from uuid import UUID
from typing import Dict, List, Any, Optional
from database.manager import SupabaseManager
from database.base_repository import BaseRepository
import logging

logger = logging.getLogger("repository.concern")

class ConcernRepository(BaseRepository):
    """
    Repositório para operações relacionadas a preocupações.
    """
    
    def __init__(self, db_manager: SupabaseManager):
        """
        Inicializa o repositório de preocupações.
        
        Args:
            db_manager: Gerenciador de conexão com o banco de dados
        """
        super().__init__(db_manager, "concerns")
    
    async def add_concern(self, profile_id: UUID, concern_data: Dict[str, Any]) -> int:
        """
        Adiciona uma nova preocupação.
        
        Args:
            profile_id: ID do perfil
            concern_data: Dados da preocupação
            
        Returns:
            ID da preocupação adicionada
        """
        try:
            data = {
                "profile_id": str(profile_id),
                **concern_data
            }
            
            result = await self.create(data)
            
            return result["concern_id"]
        except Exception as e:
            logger.error(f"Erro ao adicionar preocupação para perfil {profile_id}: {str(e)}")
            raise
    
    async def get_concerns(self, profile_id: UUID) -> List[Dict[str, Any]]:
        """
        Obtém todas as preocupações de um perfil.
        
        Args:
            profile_id: ID do perfil
            
        Returns:
            Lista de preocupações
        """
        try:
            return await self.find_all(
                filters={"profile_id": str(profile_id)}
            )
        except Exception as e:
            logger.error(f"Erro ao buscar preocupações para perfil {profile_id}: {str(e)}")
            raise
    
    async def update_concern(self, concern_id: int, updates: Dict[str, Any]) -> None:
        """
        Atualiza uma preocupação.
        
        Args:
            concern_id: ID da preocupação
            updates: Dicionário com os campos a serem atualizados
        """
        try:
            await self.update(
                id_field="concern_id",
                id_value=concern_id,
                data=updates
            )
        except Exception as e:
            logger.error(f"Erro ao atualizar preocupação {concern_id}: {str(e)}")
            raise
    
    async def remove_concern(self, concern_id: int) -> None:
        """
        Remove uma preocupação.
        
        Args:
            concern_id: ID da preocupação
        """
        try:
            await self.delete(
                id_field="concern_id",
                id_value=concern_id
            )
        except Exception as e:
            logger.error(f"Erro ao remover preocupação {concern_id}: {str(e)}")
            raise
