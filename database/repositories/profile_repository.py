from uuid import UUID
from typing import Dict, List, Any, Optional
from database.manager import SupabaseManager
from database.base_repository import BaseRepository
import logging

logger = logging.getLogger("repository.profile")

class ProfileRepository(BaseRepository):
    """
    Repositório para operações relacionadas a perfis de cliente.
    """
    
    def __init__(self, db_manager: SupabaseManager):
        """
        Inicializa o repositório de perfis.
        
        Args:
            db_manager: Gerenciador de conexão com o banco de dados
        """
        super().__init__(db_manager, "client_profiles")
    
    async def create_profile(self, user_id: UUID) -> UUID:
        """
        Cria um novo perfil de cliente.
        
        Args:
            user_id: ID do usuário (obrigatório)
            
        Returns:
            ID do perfil criado
            
        Raises:
            ValueError: Se user_id não for fornecido
        """
        try:
            if not user_id:
                logger.error("Tentativa de criar perfil sem user_id")
                raise ValueError("user_id é obrigatório para criar um perfil")
            
            from uuid import uuid4
            from datetime import datetime
            
            # Gerar profile_id explicitamente
            profile_id = uuid4()
            now = datetime.now().isoformat()
            
            # Preparar dados para inserção
            data = {
                "profile_id": str(profile_id),
                "user_id": str(user_id),
                "created_at": now,
                "updated_at": now,
                "completion_score_personal": 0.0,
                "completion_score_family": 0.0,
                "completion_score_assets": 0.0,
                "completion_score_goals": 0.0,
                "completion_score_overall": 0.0
            }
            
            # Criar perfil
            logger.info(f"Criando perfil para usuário {user_id} com ID {profile_id}")
            await self.create(data)
            
            return profile_id
        except Exception as e:
            logger.error(f"Erro ao criar perfil para usuário {user_id}: {str(e)}")
            raise
    
    async def get_profile(self, profile_id: UUID) -> Optional[Dict[str, Any]]:
        """
        Obtém um perfil pelo ID.
        
        Args:
            profile_id: ID do perfil
            
        Returns:
            Dados do perfil ou None se não encontrado
        """
        return await self.find_by_id("profile_id", str(profile_id))
    
    async def update_completion_scores(self, profile_id: UUID, scores: Dict[str, float]) -> None:
        """
        Atualiza as pontuações de completude de um perfil.
        
        Args:
            profile_id: ID do perfil
            scores: Dicionário com as pontuações a serem atualizadas
        """
        try:
            data = {}
            
            if "personal" in scores:
                data["completion_score_personal"] = scores["personal"]
            
            if "family" in scores:
                data["completion_score_family"] = scores["family"]
            
            if "assets" in scores:
                data["completion_score_assets"] = scores["assets"]
            
            if "goals" in scores:
                data["completion_score_goals"] = scores["goals"]
            
            if "overall" in scores:
                data["completion_score_overall"] = scores["overall"]
            
            await self.update(
                id_field="profile_id",
                id_value=str(profile_id),
                data=data
            )
        except Exception as e:
            logger.error(f"Erro ao atualizar pontuações de completude do perfil {profile_id}: {str(e)}")
            raise
    
    async def update_notes(self, profile_id: UUID, notes: str) -> None:
        """
        Atualiza as notas de um perfil.
        
        Args:
            profile_id: ID do perfil
            notes: Notas a serem atualizadas
        """
        try:
            await self.update(
                id_field="profile_id",
                id_value=str(profile_id),
                data={"notes": notes}
            )
        except Exception as e:
            logger.error(f"Erro ao atualizar notas do perfil {profile_id}: {str(e)}")
            raise
