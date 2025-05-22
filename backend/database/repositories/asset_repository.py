from uuid import UUID
from typing import Dict, List, Any, Optional
from database.manager import SupabaseManager
from database.base_repository import BaseRepository
import logging

logger = logging.getLogger("repository.asset")

class AssetRepository(BaseRepository):
    """
    Repositório para operações relacionadas a ativos.
    """
    
    def __init__(self, db_manager: SupabaseManager):
        """
        Inicializa o repositório de ativos.
        
        Args:
            db_manager: Gerenciador de conexão com o banco de dados
        """
        super().__init__(db_manager, "assets")
    
    async def add_asset(self, profile_id: UUID, asset_data: Dict[str, Any]) -> int:
        """
        Adiciona um novo ativo.
        
        Args:
            profile_id: ID do perfil
            asset_data: Dados do ativo
            
        Returns:
            ID do ativo adicionado
        """
        try:
            data = {
                "profile_id": str(profile_id),
                **asset_data
            }
            
            result = await self.create(data)
            
            return result["asset_id"]
        except Exception as e:
            logger.error(f"Erro ao adicionar ativo para perfil {profile_id}: {str(e)}")
            raise
    
    async def get_assets(self, profile_id: UUID) -> List[Dict[str, Any]]:
        """
        Obtém todos os ativos de um perfil.
        
        Args:
            profile_id: ID do perfil
            
        Returns:
            Lista de ativos
        """
        try:
            return await self.find_all(
                filters={"profile_id": str(profile_id)}
            )
        except Exception as e:
            logger.error(f"Erro ao buscar ativos para perfil {profile_id}: {str(e)}")
            raise
    
    async def update_asset(self, asset_id: int, updates: Dict[str, Any]) -> None:
        """
        Atualiza um ativo.
        
        Args:
            asset_id: ID do ativo
            updates: Dicionário com os campos a serem atualizados
        """
        try:
            await self.update(
                id_field="asset_id",
                id_value=asset_id,
                data=updates
            )
        except Exception as e:
            logger.error(f"Erro ao atualizar ativo {asset_id}: {str(e)}")
            raise
    
    async def remove_asset(self, asset_id: int) -> None:
        """
        Remove um ativo.
        
        Args:
            asset_id: ID do ativo
        """
        try:
            await self.delete(
                id_field="asset_id",
                id_value=asset_id
            )
        except Exception as e:
            logger.error(f"Erro ao remover ativo {asset_id}: {str(e)}")
            raise
