# agents/conversation_db.py
from pydantic_ai import Agent, RunContext
from typing import Optional, List, Dict, Any
from uuid import UUID
from models.pydantic_models import ClientProfile, ConversationMessage
from agents.conversation import NextQuestionOutput
from services.session_service import SessionService

class ConversationDependencies:
    profile: ClientProfile
    conversation_history: List[ConversationMessage]
    missing_fields: Dict[str, List[str]] = {}
    extraction_confidence: float = 0.0
    last_extraction_updates: Dict[str, Any] = {}
    session_id: Optional[UUID] = None  # New field to track the session

async def prepare_conversation_agent_context(session_service: SessionService, session_id: UUID) -> ConversationDependencies:
    """Prepare the context for the conversation agent from the database."""
    # Get complete session
    session = await session_service.get_session_with_profile(session_id)
    
    # Prepare dependencies
    deps = ConversationDependencies()
    deps.profile = session.profile
    deps.conversation_history = session.conversation_history
    deps.session_id = session_id
    
    # Identify missing fields
    # You can use the existing identify_missing_fields function or implement similar logic here
    # For now, we'll leave this empty
    deps.missing_fields = {}
    
    # Set extraction confidence based on the last user message with extraction data
    last_extraction = None
    for msg in reversed(session.conversation_history):
        if msg.role == "user" and msg.extracted_entities:
            last_extraction = msg
            break
    
    if last_extraction and last_extraction.extracted_entities:
        deps.extraction_confidence = last_extraction.extracted_entities.get("confidence_score", 0.0)
        
        # Set last extraction updates
              # Set last extraction updates
        updates = {}
        if last_extraction.extracted_entities.get("personal_info_updates"):
            updates["personal"] = last_extraction.extracted_entities.get("personal_info_updates")
        if last_extraction.extracted_entities.get("family_members_updates"):
            # Directly use the integer value instead of calling len()
            updates["family"] = f"{last_extraction.extracted_entities.get('family_members_updates')} member(s)"
        if last_extraction.extracted_entities.get("assets_updates"):
            # Directly use the integer value instead of calling len()
            updates["assets"] = f"{last_extraction.extracted_entities.get('assets_updates')} asset(s)"
        if last_extraction.extracted_entities.get("goals_updates"):
            # Directly use the integer value instead of calling len()
            updates["goals"] = f"{last_extraction.extracted_entities.get('goals_updates')} goal(s)"
        if last_extraction.extracted_entities.get("concerns_updates"):
            # Directly use the integer value instead of calling len()
            updates["concerns"] = f"{last_extraction.extracted_entities.get('concerns_updates')} concern(s)"
        
        deps.last_extraction_updates = updates
    else:
        deps.extraction_confidence = 0.0
    
    return deps

async def save_agent_response(session_service: SessionService, session_id: UUID, 
                              next_question: NextQuestionOutput) -> None:
    """Save the agent's response to the database."""
    # Add message to conversation history
    await session_service.add_message(
        session_id=session_id,
        role="assistant",
        content=next_question.question,
        extracted_entities={
            "section_focus": next_question.section_focus,
            "targeted_fields": next_question.targeted_fields,
            "follow_up": next_question.follow_up,
            "context": next_question.context
        }
    )
    
    # Update session state
    await session_service.update_session_state(
        session_id=session_id,
        current_step=next_question.section_focus
    )