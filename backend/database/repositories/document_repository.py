from uuid import UUID
from typing import Dict, List, Any, Optional
from database.manager import SupabaseManager
from database.base_repository import BaseRepository
import logging

logger = logging.getLogger("repository.document")

class DocumentRepository(BaseRepository):
    """
    Repositório para operações relacionadas a recomendações de documentos.
    """
    
    def __init__(self, db_manager: SupabaseManager):
        """
        Inicializa o repositório de documentos.
        
        Args:
            db_manager: Gerenciador de conexão com o banco de dados
        """
        super().__init__(db_manager, "document_recommendations")
    
    async def add_document_recommendation(self, profile_id: UUID, recommendation_data: Dict[str, Any]) -> int:
        """
        Adiciona uma nova recomendação de documento.
        
        Args:
            profile_id: ID do perfil
            recommendation_data: Dados da recomendação
            
        Returns:
            ID da recomendação adicionada
        """
        try:
            data = {
                "profile_id": str(profile_id),
                **recommendation_data
            }
            
            result = await self.create(data)
            
            return result["recommendation_id"]
        except Exception as e:
            logger.error(f"Erro ao adicionar recomendação de documento para perfil {profile_id}: {str(e)}")
            raise
    
    async def get_document_recommendations(self, profile_id: UUID) -> List[Dict[str, Any]]:
        """
        Obtém todas as recomendações de documentos de um perfil.
        
        Args:
            profile_id: ID do perfil
            
        Returns:
            Lista de recomendações de documentos
        """
        try:
            return await self.find_all(
                filters={"profile_id": str(profile_id)}
            )
        except Exception as e:
            logger.error(f"Erro ao buscar recomendações de documentos para perfil {profile_id}: {str(e)}")
            raise
    
    async def clear_document_recommendations(self, profile_id: UUID) -> None:
        """
        Remove todas as recomendações de documentos de um perfil.
        
        Args:
            profile_id: ID do perfil
        """
        try:
            # Busca todas as recomendações
            recommendations = await self.get_document_recommendations(profile_id)
            
            # Remove cada uma
            for recommendation in recommendations:
                await self.delete(
                    id_field="recommendation_id",
                    id_value=recommendation["recommendation_id"]
                )
        except Exception as e:
            logger.error(f"Erro ao limpar recomendações de documentos para perfil {profile_id}: {str(e)}")
            raise
