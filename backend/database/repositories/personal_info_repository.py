from uuid import UUID
from typing import Dict, List, Any, Optional
from database.manager import SupabaseManager
from database.base_repository import BaseRepository
import logging

logger = logging.getLogger("repository.personal_info")

class PersonalInfoRepository(BaseRepository):
    """
    Repositório para operações relacionadas a informações pessoais.
    """
    
    def __init__(self, db_manager: SupabaseManager):
        """
        Inicializa o repositório de informações pessoais.
        
        Args:
            db_manager: Gerenciador de conexão com o banco de dados
        """
        super().__init__(db_manager, "personal_info")
    
    async def create_personal_info(self, profile_id: UUID) -> int:
        """
        Cria um novo registro de informações pessoais.
        
        Args:
            profile_id: ID do perfil
            
        Returns:
            ID do registro criado
        """
        try:
            data = {
                "profile_id": str(profile_id),
                "name": None,
                "age": None,
                "marital_status": None,
                "profession": None
            }
            
            result = await self.create(data)
            
            return result["personal_info_id"]
        except Exception as e:
            logger.error(f"Erro ao criar informações pessoais para perfil {profile_id}: {str(e)}")
            raise
    
    async def get_personal_info(self, profile_id: UUID) -> Optional[Dict[str, Any]]:
        """
        Obtém as informações pessoais de um perfil.
        
        Args:
            profile_id: ID do perfil
            
        Returns:
            Dados das informações pessoais ou None se não encontradas
        """
        try:
            results = await self.find_all(
                filters={"profile_id": str(profile_id)}
            )
            
            return results[0] if results else None
        except Exception as e:
            logger.error(f"Erro ao buscar informações pessoais para perfil {profile_id}: {str(e)}")
            raise
    
    async def update_personal_info(self, profile_id: UUID, updates: Dict[str, Any]) -> None:
        """
        Atualiza as informações pessoais de um perfil.
        
        Args:
            profile_id: ID do perfil
            updates: Dicionário com os campos a serem atualizados
        """
        try:
            # Primeiro, busca o registro existente
            existing = await self.get_personal_info(profile_id)
            
            if not existing:
                logger.warning(f"Informações pessoais não encontradas para perfil {profile_id}. Criando novo registro.")
                await self.create_personal_info(profile_id)
                existing = await self.get_personal_info(profile_id)
                
                if not existing:
                    raise ValueError(f"Não foi possível criar informações pessoais para perfil {profile_id}")
            
            # Atualiza o registro
            await self.update(
                id_field="personal_info_id",
                id_value=existing["personal_info_id"],
                data=updates
            )
        except Exception as e:
            logger.error(f"Erro ao atualizar informações pessoais para perfil {profile_id}: {str(e)}")
            raise
