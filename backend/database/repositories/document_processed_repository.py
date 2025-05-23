# database/repositories/document_processed_repository.py
from uuid import UUID
from typing import Dict, List, Any, Optional
from database.manager import SupabaseManager
from database.base_repository import BaseRepository
import logging
import json

logger = logging.getLogger("repository.document_processed")

class DocumentProcessedRepository(BaseRepository):
    """
    Repositório para operações relacionadas a documentos processados.
    """
    
    def __init__(self, db_manager: SupabaseManager):
        """
        Inicializa o repositório de documentos processados.
        
        Args:
            db_manager: Gerenciador de conexão com o banco de dados
        """
        super().__init__(db_manager, "processed_documents")
    
    async def add_document(self, document_data: Dict[str, Any]) -> UUID:
        """
        Adiciona um novo documento processado.
        
        Args:
            document_data: Dados do documento processado
            
        Returns:
            ID do documento adicionado
        """
        try:
            # Certificar-se de que extraction_result está serializado como JSON
            if "extraction_result" in document_data and not isinstance(document_data["extraction_result"], str):
                document_data["extraction_result"] = json.dumps(document_data["extraction_result"])
            
            result = await self.create(document_data)
            
            return UUID(result["document_id"])
        except Exception as e:
            logger.error(f"Erro ao adicionar documento processado: {str(e)}")
            raise
    
    async def get_document(self, document_id: UUID) -> Optional[Dict[str, Any]]:
        """
        Obtém um documento processado pelo ID.
        
        Args:
            document_id: ID do documento
            
        Returns:
            Dados do documento ou None se não encontrado
        """
        try:
            document = await self.find_by_id("document_id", str(document_id))
            
            # Deserializar extraction_result
            if document and "extraction_result" in document and document["extraction_result"]:
                try:
                    document["extraction_result"] = json.loads(document["extraction_result"])
                except:
                    logger.warning(f"Não foi possível deserializar extraction_result para documento {document_id}")
            
            return document
        except Exception as e:
            logger.error(f"Erro ao buscar documento {document_id}: {str(e)}")
            raise
    
    async def get_user_documents(self, user_id: UUID) -> List[Dict[str, Any]]:
        """
        Obtém todos os documentos processados de um usuário.
        
        Args:
            user_id: ID do usuário
            
        Returns:
            Lista de documentos processados
        """
        try:
            documents = await self.find_all(
                filters={"user_id": str(user_id)},
                order="processed_at.desc"
            )
            
            # Deserializar extraction_result para cada documento
            for document in documents:
                if "extraction_result" in document and document["extraction_result"]:
                    try:
                        document["extraction_result"] = json.loads(document["extraction_result"])
                    except:
                        logger.warning(f"Não foi possível deserializar extraction_result para um documento")
            
            return documents
        except Exception as e:
            logger.error(f"Erro ao buscar documentos para usuário {user_id}: {str(e)}")
            raise
    
    async def get_documents_by_profile(self, profile_id: UUID) -> List[Dict[str, Any]]:
        """
        Obtém todos os documentos processados para um perfil.
        
        Args:
            profile_id: ID do perfil
            
        Returns:
            Lista de documentos processados
        """
        try:
            documents = await self.find_all(
                filters={"profile_id": str(profile_id)},
                order="processed_at.desc"
            )
            
            # Deserializar extraction_result para cada documento
            for document in documents:
                if "extraction_result" in document and document["extraction_result"]:
                    try:
                        document["extraction_result"] = json.loads(document["extraction_result"])
                    except:
                        logger.warning(f"Não foi possível deserializar extraction_result para um documento")
            
            return documents
        except Exception as e:
            logger.error(f"Erro ao buscar documentos para perfil {profile_id}: {str(e)}")
            raise
    
    async def get_document_by_key(self, user_id: UUID, document_key: str) -> Optional[Dict[str, Any]]:
        """
        Obtém um documento pelo document_key para um usuário específico.
        
        Args:
            user_id: ID do usuário
            document_key: Chave do documento
            
        Returns:
            Documento ou None se não encontrado
        """
        try:
            documents = await self.find_all(
                filters={
                    "user_id": str(user_id),
                    "document_key": document_key
                },
                order="processed_at.desc",
                limit=1
            )
            
            if not documents:
                return None
                
            document = documents[0]
            
            # Deserializar extraction_result
            if "extraction_result" in document and document["extraction_result"]:
                try:
                    document["extraction_result"] = json.loads(document["extraction_result"])
                except:
                    logger.warning(f"Não foi possível deserializar extraction_result")
            
            return document
        except Exception as e:
            logger.error(f"Erro ao buscar documento por chave {document_key} para usuário {user_id}: {str(e)}")
            raise
    
    async def update_document(self, document_id: UUID, updates: Dict[str, Any]) -> None:
        """
        Atualiza um documento processado.
        
        Args:
            document_id: ID do documento
            updates: Dados a serem atualizados
        """
        try:
            # Certificar-se de que extraction_result está serializado como JSON
            if "extraction_result" in updates and not isinstance(updates["extraction_result"], str):
                updates["extraction_result"] = json.dumps(updates["extraction_result"])
            
            await self.update(
                id_field="document_id",
                id_value=str(document_id),
                data=updates
            )
        except Exception as e:
            logger.error(f"Erro ao atualizar documento {document_id}: {str(e)}")
            raise
    
    async def delete_document(self, document_id: UUID) -> None:
        """
        Exclui um documento processado.
        
        Args:
            document_id: ID do documento
        """
        try:
            await self.delete(
                id_field="document_id",
                id_value=str(document_id)
            )
        except Exception as e:
            logger.error(f"Erro ao excluir documento {document_id}: {str(e)}")
            raise