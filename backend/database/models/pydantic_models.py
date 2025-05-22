from pydantic import BaseModel, Field, field_validator
from typing import List, Dict, Optional, Any
from enum import Enum
from datetime import datetime
from uuid import UUID, uuid4


class MaritalStatus(str, Enum):
    """Enum simplificado para estado civil"""
    SINGLE = "solteiro"
    MARRIED = "casado"
    DIVORCED = "divorciado"
    WIDOWED = "viúvo"
    STABLE_UNION = "união estável"
    OTHER = "outro"


class AssetType(str, Enum):
    """Tipos básicos de patrimônio"""
    REAL_ESTATE = "imóvel"
    COMPANY = "empresa"
    FINANCIAL = "investimento financeiro"
    RURAL = "propriedade rural"
    OTHER = "outro"


class GoalType(str, Enum):
    """Objetivos principais com a holding"""
    SUCCESSION = "sucessão familiar"
    TAX = "otimização fiscal"
    PROTECTION = "proteção patrimonial"
    GOVERNANCE = "governança familiar"
    OTHER = "outro"


class PersonalInfo(BaseModel):
    """Informações pessoais básicas do cliente"""
    name: Optional[str] = None
    age: Optional[int] = None
    marital_status: Optional[MaritalStatus] = None
    profession: Optional[str] = None


class FamilyMember(BaseModel):
    """Modelo simplificado para membro da família"""
    relation: str  # cônjuge, filho(a), etc.
    name: Optional[str] = None
    age: Optional[int] = None
    is_dependent: Optional[bool] = None  # se é dependente financeiro



class Asset(BaseModel):
    """Modelo simplificado para patrimônio"""
    asset_type: AssetType
    description: str
    estimated_value: Optional[float] = None
    location: Optional[str] = None  # cidade/estado/país
    ownership: Optional[str] = None  # próprio nome, empresa, etc.
    notes: Optional[str] = None


class Goal(BaseModel):
    """Objetivos simplificados com a holding"""
    goal_type: GoalType
    description: str
    priority: Optional[int] = None  # 1-3, sendo 3 a maior prioridade


class Concern(BaseModel):
    """Preocupações do cliente"""
    description: str
    priority: Optional[int] = None  # 1-3, sendo 3 a maior prioridade


class CompletionScore(BaseModel):
    """Pontuação de completude por seção"""
    personal: float = 0.0
    family: float = 0.0
    assets: float = 0.0
    goals: float = 0.0
    overall: float = 0.0

class DocumentCategory(str, Enum):
    """Categorias de documentos"""
    PERSONAL = "pessoal"
    FAMILY = "familiar"
    REAL_ESTATE = "imovel"
    VEHICLE = "veiculo"
    COMPANY = "empresa"
    FINANCIAL = "financeiro"
    LEGAL = "juridico"
    TAX = "tributario"
    RURAL = "rural"

class DocumentRecommendation(BaseModel):
    """Recomendação de documento para a próxima etapa"""
    name: str
    document_key: str  # ✨ Chave única para OCR/extração (ex: "rg", "certidao_casamento")
    category: DocumentCategory
    description: str
    reason: Optional[str] = None
    is_mandatory: bool = True
    priority: int = Field(default=1, ge=1, le=5)  # 1=baixa, 5=alta
    
    # Para documentos específicos por item
    related_to: Optional[str] = None  # ID ou descrição do item relacionado
    item_type: Optional[str] = None   # tipo do item (imóvel, veículo, etc.)
    item_description: Optional[str] = None  # descrição do item específico
    item_index: Optional[int] = None  # índice do item (imóvel 1, 2, etc.)
    
    # Informações sobre como obter
    how_to_obtain: Optional[str] = None
    estimated_cost: Optional[str] = None
    processing_time: Optional[str] = None
    
    # Metadados
    group_id: Optional[str] = None  # para agrupar documentos relacionados
    depends_on: Optional[List[str]] = None  # documentos que devem vir antes
    alternatives: Optional[List[str]] = None  # documentos alternativos aceitos

class ClientProfile(BaseModel):
    """Perfil simplificado do cliente para onboarding inicial"""
    # Identificação da sessão
    profile_id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
    # Dados básicos do perfil
    personal_info: PersonalInfo = Field(default_factory=PersonalInfo)
    family_members: List[FamilyMember] = []
    assets: List[Asset] = []
    goals: List[Goal] = []
    concerns: List[Concern] = []
    
    
    # Metadados de progresso
    completion_score: CompletionScore = Field(default_factory=CompletionScore)
    
    # Recomendações de documentos
    document_recommendations: List[DocumentRecommendation] = []
    
    # Campo para notas ou observações
    notes: Optional[str] = None
    
    @field_validator('updated_at', mode='before')
    @classmethod
    def update_timestamp(cls, v):
        """Atualiza o timestamp sempre que o modelo é validado"""
        return datetime.now()


class ConversationMessage(BaseModel):
    """Modelo para mensagens da conversa"""
    message_id: UUID = Field(default_factory=uuid4)
    session_id: UUID
    timestamp: datetime = Field(default_factory=datetime.now)
    role: str  # "user" ou "assistant"
    content: str
    extracted_entities: Optional[Dict[str, Any]] = None


class Session(BaseModel):
    """Modelo para sessão de onboarding"""
    session_id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    is_active: bool = True
    is_complete: bool = False
    completion_percentage: float = 0.0
    profile: ClientProfile = Field(default_factory=ClientProfile)
    conversation_history: List[ConversationMessage]
    
    @field_validator('updated_at', mode='before')
    @classmethod
    def update_timestamp(cls, v):
        """Atualiza o timestamp sempre que o modelo é validado"""
        return datetime.now()
