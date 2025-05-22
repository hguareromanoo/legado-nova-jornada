# utils/conversions.py
from uuid import UUID
from typing import Dict, List, Any, Optional
from datetime import datetime
from models.pydantic_models import (
    ClientProfile, PersonalInfo, FamilyMember, Asset, Goal, Concern,
    DocumentRecommendation, CompletionScore, ConversationMessage, Session,
    MaritalStatus, AssetType, GoalType
)

def db_to_personal_info(db_data: Optional[Dict[str, Any]]) -> PersonalInfo:
    """Convert database record to PersonalInfo model."""
    if not db_data:
        return PersonalInfo()
    
    return PersonalInfo(
        name=db_data.get("name"),
        age=db_data.get("age"),
        marital_status=MaritalStatus(db_data.get("marital_status")) if db_data.get("marital_status") else None,
        profession=db_data.get("profession")
    )

def db_to_family_member(db_data: Dict[str, Any]) -> FamilyMember:
    """Convert database record to FamilyMember model."""
    return FamilyMember(
        relation=db_data.get("relation"),
        name=db_data.get("name"),
        age=db_data.get("age"),
        is_dependent=db_data.get("is_dependent")
    )

def db_to_asset(db_data: Dict[str, Any]) -> Asset:
    """Convert database record to Asset model."""
    return Asset(
        asset_type=AssetType(db_data.get("asset_type")),
        description=db_data.get("description"),
        estimated_value=db_data.get("estimated_value"),
        location=db_data.get("location"),
        ownership=db_data.get("ownership"),
        notes=db_data.get("notes")
    )

def db_to_goal(db_data: Dict[str, Any]) -> Goal:
    """Convert database record to Goal model."""
    return Goal(
        goal_type=GoalType(db_data.get("goal_type")),
        description=db_data.get("description"),
        priority=db_data.get("priority")
    )

def db_to_concern(db_data: Dict[str, Any]) -> Concern:
    """Convert database record to Concern model."""
    return Concern(
        description=db_data.get("description"),
        priority=db_data.get("priority")
    )

def db_to_document_recommendation(db_data: Dict[str, Any]) -> DocumentRecommendation:
    """Convert database record to DocumentRecommendation model."""
    return DocumentRecommendation(
        name=db_data.get("name"),
        reason=db_data.get("reason"),
        is_mandatory=db_data.get("is_mandatory")
    )

def db_to_completion_score(db_data: Dict[str, Any]) -> CompletionScore:
    """Convert database record to CompletionScore model."""
    return CompletionScore(
        personal=db_data.get("completion_score_personal", 0),
        family=db_data.get("completion_score_family", 0),
        assets=db_data.get("completion_score_assets", 0),
        goals=db_data.get("completion_score_goals", 0),
        overall=db_data.get("completion_score_overall", 0)
    )

def db_to_conversation_message(db_data: Dict[str, Any]) -> ConversationMessage:
    """Convert database record to ConversationMessage model."""
    return ConversationMessage(
        message_id=UUID(db_data.get("message_id")) if db_data.get("message_id") else None,
        session_id=UUID(db_data.get("session_id")) if db_data.get("session_id") else None,
        timestamp=datetime.fromisoformat(db_data.get("timestamp")) if db_data.get("timestamp") else datetime.now(),
        role=db_data.get("role", ""),
        content=db_data.get("content", ""),
        extracted_entities=db_data.get("extracted_entities")
    )

def db_to_client_profile(
    profile_data: Dict[str, Any],
    personal_info_data: Optional[Dict[str, Any]],
    family_members_data: List[Dict[str, Any]],
    assets_data: List[Dict[str, Any]],
    goals_data: List[Dict[str, Any]],
    concerns_data: List[Dict[str, Any]],
    document_recommendations_data: List[Dict[str, Any]]
) -> ClientProfile:
    """Convert database records to a complete ClientProfile model."""
    
    # Process personal info
    personal_info = db_to_personal_info(personal_info_data)
    
    # Process family members
    family_members = [db_to_family_member(member) for member in family_members_data]
    
    # Process assets
    assets = [db_to_asset(asset) for asset in assets_data]
    
    # Process goals
    goals = [db_to_goal(goal) for goal in goals_data]
    
    # Process concerns
    concerns = [db_to_concern(concern) for concern in concerns_data]
    
    # Process document recommendations
    document_recommendations = [db_to_document_recommendation(doc) for doc in document_recommendations_data]
    
    # Process completion score
    completion_score = db_to_completion_score(profile_data)
    
    # Create ClientProfile
    return ClientProfile(
        profile_id=UUID(profile_data.get("profile_id")) if profile_data.get("profile_id") else None,
        created_at=datetime.fromisoformat(profile_data.get("created_at")) if profile_data.get("created_at") else datetime.now(),
        updated_at=datetime.fromisoformat(profile_data.get("updated_at")) if profile_data.get("updated_at") else datetime.now(),
        personal_info=personal_info,
        family_members=family_members,
        assets=assets,
        goals=goals,
        concerns=concerns,
        completion_score=completion_score,
        document_recommendations=document_recommendations,
        notes=profile_data.get("notes")
    )

def db_to_session(
    session_data: Dict[str, Any],
    profile: ClientProfile,
    conversation_history: List[ConversationMessage]
) -> Session:
    """Convert database records to a complete Session model."""
    return Session(
        session_id=UUID(session_data.get("session_id")) if session_data.get("session_id") else None,
        user_id=UUID(session_data.get("user_id")) if session_data.get("user_id") else None,
        created_at=datetime.fromisoformat(session_data.get("created_at")) if session_data.get("created_at") else datetime.now(),
        updated_at=datetime.fromisoformat(session_data.get("updated_at")) if session_data.get("updated_at") else datetime.now(),
        is_active=session_data.get("is_active", True),
        is_complete=session_data.get("is_complete", False),
        completion_percentage=session_data.get("completion_percentage", 0.0),
        profile=profile,
        current_step=session_data.get("current_step"),
        last_page=session_data.get("last_page"),
        conversation_history=conversation_history
    )

# Conversion functions from Pydantic models to database dictionaries

def personal_info_to_db(model: PersonalInfo) -> Dict[str, Any]:
    """Convert PersonalInfo model to database dictionary."""
    db_dict = model.model_dump(exclude_none=True)
    
    # Handle enum conversion
    if "marital_status" in db_dict and db_dict["marital_status"] is not None:
        db_dict["marital_status"] = db_dict["marital_status"].value
    
    return db_dict

def family_member_to_db(model: FamilyMember) -> Dict[str, Any]:
    """Convert FamilyMember model to database dictionary."""
    return model.model_dump(exclude_none=True)

def asset_to_db(model: Asset) -> Dict[str, Any]:
    """Convert Asset model to database dictionary."""
    db_dict = model.model_dump(exclude_none=True)
    
    # Handle enum conversion
    if "asset_type" in db_dict and db_dict["asset_type"] is not None:
        db_dict["asset_type"] = db_dict["asset_type"].value
    
    return db_dict

def goal_to_db(model: Goal) -> Dict[str, Any]:
    """Convert Goal model to database dictionary."""
    db_dict = model.model_dump(exclude_none=True)
    
    # Handle enum conversion
    if "goal_type" in db_dict and db_dict["goal_type"] is not None:
        db_dict["goal_type"] = db_dict["goal_type"].value
    
    return db_dict

def concern_to_db(model: Concern) -> Dict[str, Any]:
    """Convert Concern model to database dictionary."""
    return model.model_dump(exclude_none=True)

def document_recommendation_to_db(model: DocumentRecommendation) -> Dict[str, Any]:
    """Convert DocumentRecommendation model to database dictionary."""
    return model.model_dump(exclude_none=True)

def completion_score_to_db(model: CompletionScore) -> Dict[str, Any]:
    """Convert CompletionScore model to database dictionary for profile updates."""
    return {
        "completion_score_personal": model.personal,
        "completion_score_family": model.family,
        "completion_score_assets": model.assets,
        "completion_score_goals": model.goals,
        "completion_score_overall": model.overall
    }

def sanitize_for_db(value: Any) -> Any:
    """Sanitize values to be safe for database storage by removing problematic characters."""
    if isinstance(value, str):
        # Remove null characters and other problematic Unicode characters
        return value.replace('\u0000', '')
    elif isinstance(value, dict):
        return {k: sanitize_for_db(v) for k, v in value.items()}
    elif isinstance(value, list):
        return [sanitize_for_db(item) for item in value]
    else:
        return value

def conversation_message_to_db(model: ConversationMessage) -> Dict[str, Any]:
    """Convert ConversationMessage model to database dictionary."""
    db_dict = model.model_dump(exclude_none=True, exclude={"message_id", "session_id"})
    
    # Handle datetime conversion
    if "timestamp" in db_dict and db_dict["timestamp"] is not None:
        db_dict["timestamp"] = db_dict["timestamp"].isoformat()
    
    # Sanitize all string values before saving to database
    return sanitize_for_db(db_dict)

def format_iso_datetime(dt: datetime) -> str:
    """Format a datetime as ISO string for Supabase."""
    return dt.isoformat()

def parse_iso_datetime(dt_str: Optional[str]) -> Optional[datetime]:
    """Parse an ISO datetime string from Supabase."""
    if not dt_str:
        return None
    return datetime.fromisoformat(dt_str)