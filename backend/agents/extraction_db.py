# agents/extraction_db.py
from pydantic_ai import Agent, RunContext
from typing import Optional, List, Dict, Any
from uuid import UUID
from models.pydantic_models import ClientProfile
from agents.extraction import ExtractionOutput
from services.profile_service import ProfileService
from services.session_service import SessionService

class ExtractionDependencies:
    current_profile: Optional[ClientProfile] = None
    section_focus: Optional[str] = None
    targeted_fields: Optional[List[str]] = None
    session_id: Optional[UUID] = None  # New field to track the session

async def prepare_extraction_agent_context(profile_service: ProfileService, 
                                         session_id: UUID, profile_id: UUID,
                                         section_focus: Optional[str] = None,
                                         targeted_fields: Optional[List[str]] = None) -> ExtractionDependencies:
    """Prepare the context for the extraction agent from the database."""
    # Get complete profile
    profile = await profile_service.get_complete_profile(profile_id)
    
    # Prepare dependencies
    deps = ExtractionDependencies()
    deps.current_profile = profile
    deps.section_focus = section_focus
    deps.targeted_fields = targeted_fields
    deps.session_id = session_id
    
    return deps

async def process_extraction_result(profile_service: ProfileService, 
                                  session_service: SessionService,
                                  session_id: UUID, user_input: str,
                                  extraction_output: ExtractionOutput) -> ClientProfile:
    """Process the extraction result and update the database."""
    # Get session
    session = await session_service.get_session_with_profile(session_id)
    profile_id = session.profile.profile_id
    
    # Add user message to conversation history
    await session_service.add_message(
        session_id=session_id,
        role="user",
        content=user_input,
        extracted_entities={
            "confidence_score": extraction_output.confidence_score,
            "missing_fields": extraction_output.missing_fields,
            "extraction_feedback": extraction_output.extraction_feedback,
            "personal_info_updates": extraction_output.personal_info_updates.model_dump() if extraction_output.personal_info_updates else None,
            "family_members_updates": len(extraction_output.family_members_updates or []),
            "assets_updates": len(extraction_output.assets_updates or []),
            "goals_updates": len(extraction_output.goals_updates or []),
            "concerns_updates": len(extraction_output.concerns_updates or [])
        }
    )
    
    # Update profile with extracted information
    updated_profile = await profile_service.update_profile(profile_id, extraction_output)
    
    # Update session progress
    await session_service.update_session_progress(
        session_id=session_id,
        completion_percentage=updated_profile.completion_score.overall
    )
    
    return updated_profile