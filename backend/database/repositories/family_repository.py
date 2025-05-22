from uuid import UUID
from typing import Dict, List, Any, Optional
from database.manager import SupabaseManager
from database.base_repository import BaseRepository
import logging

logger = logging.getLogger("repository.family")

class FamilyRepository(BaseRepository):
    """
    Repositório para operações relacionadas a membros da família.
    """
    
    def __init__(self, db_manager: SupabaseManager):
        """
        Inicializa o repositório de membros da família.
        
        Args:
            db_manager: Gerenciador de conexão com o banco de dados
        """
        super().__init__(db_manager, "family_members")
    
    async def add_family_member(self, profile_id: UUID, member_data: Dict[str, Any]) -> int:
        """
        Adiciona um novo membro da família.
        
        Args:
            profile_id: ID do perfil
            member_data: Dados do membro da família
            
        Returns:
            ID do membro adicionado
        """
        try:
            data = {
                "profile_id": str(profile_id),
                **member_data
            }
            
            result = await self.create(data)
            
            return result["member_id"]
        except Exception as e:
            logger.error(f"Erro ao adicionar membro da família para perfil {profile_id}: {str(e)}")
            raise
    
    async def get_family_members(self, profile_id: UUID) -> List[Dict[str, Any]]:
        """
        Obtém todos os membros da família de um perfil.
        
        Args:
            profile_id: ID do perfil
            
        Returns:
            Lista de membros da família
        """
        try:
            return await self.find_all(
                filters={"profile_id": str(profile_id)}
            )
        except Exception as e:
            logger.error(f"Erro ao buscar membros da família para perfil {profile_id}: {str(e)}")
            raise
    
    async def update_family_member(self, member_id: int, updates: Dict[str, Any]) -> None:
        """
        Atualiza um membro da família.
        
        Args:
            member_id: ID do membro
            updates: Dicionário com os campos a serem atualizados
        """
        try:
            await self.update(
                id_field="member_id",
                id_value=member_id,
                data=updates
            )
        except Exception as e:
            logger.error(f"Erro ao atualizar membro da família {member_id}: {str(e)}")
            raise
    
    async def remove_family_member(self, member_id: int) -> None:
        """
        Remove um membro da família.
        
        Args:
            member_id: ID do membro
        """
        try:
            await self.delete(
                id_field="member_id",
                id_value=member_id
            )
        except Exception as e:
            logger.error(f"Erro ao remover membro da família {member_id}: {str(e)}")
            raise
