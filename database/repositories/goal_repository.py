from uuid import UUID
from typing import Dict, List, Any, Optional
from database.manager import SupabaseManager
from database.base_repository import BaseRepository
import logging

logger = logging.getLogger("repository.goal")

class GoalRepository(BaseRepository):
    """
    Repositório para operações relacionadas a objetivos.
    """
    
    def __init__(self, db_manager: SupabaseManager):
        """
        Inicializa o repositório de objetivos.
        
        Args:
            db_manager: Gerenciador de conexão com o banco de dados
        """
        super().__init__(db_manager, "goals")
    
    async def add_goal(self, profile_id: UUID, goal_data: Dict[str, Any]) -> int:
        """
        Adiciona um novo objetivo.
        
        Args:
            profile_id: ID do perfil
            goal_data: Dados do objetivo
            
        Returns:
            ID do objetivo adicionado
        """
        try:
            data = {
                "profile_id": str(profile_id),
                **goal_data
            }
            
            result = await self.create(data)
            
            return result["goal_id"]
        except Exception as e:
            logger.error(f"Erro ao adicionar objetivo para perfil {profile_id}: {str(e)}")
            raise
    
    async def get_goals(self, profile_id: UUID) -> List[Dict[str, Any]]:
        """
        Obtém todos os objetivos de um perfil.
        
        Args:
            profile_id: ID do perfil
            
        Returns:
            Lista de objetivos
        """
        try:
            return await self.find_all(
                filters={"profile_id": str(profile_id)}
            )
        except Exception as e:
            logger.error(f"Erro ao buscar objetivos para perfil {profile_id}: {str(e)}")
            raise
    
    async def update_goal(self, goal_id: int, updates: Dict[str, Any]) -> None:
        """
        Atualiza um objetivo.
        
        Args:
            goal_id: ID do objetivo
            updates: Dicionário com os campos a serem atualizados
        """
        try:
            await self.update(
                id_field="goal_id",
                id_value=goal_id,
                data=updates
            )
        except Exception as e:
            logger.error(f"Erro ao atualizar objetivo {goal_id}: {str(e)}")
            raise
    
    async def remove_goal(self, goal_id: int) -> None:
        """
        Remove um objetivo.
        
        Args:
            goal_id: ID do objetivo
        """
        try:
            await self.delete(
                id_field="goal_id",
                id_value=goal_id
            )
        except Exception as e:
            logger.error(f"Erro ao remover objetivo {goal_id}: {str(e)}")
            raise
