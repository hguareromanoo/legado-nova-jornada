# services/document_service.py
from uuid import UUID, uuid4
from typing import Dict, List, Any, Optional
from database.repositories.document_processed_repository import DocumentProcessedRepository
from database.manager import SupabaseManager
from services.data_extractor.extractors import run_data_extraction_process
from services.documents_section_processing.proccess_doc import process_and_add_document, get_collection, client
import os
import tempfile
import base64
import json
import logging
from datetime import datetime

# Configurar logging
logger = logging.getLogger("service.document")

class DocumentService:
    """
    Serviço para gerenciamento de documentos processados.
    Implementa lógica de negócio relacionada a documentos, extração e vetorização.
    """
    
    def __init__(self, db_manager: SupabaseManager):
        """
        Inicializa o serviço de documentos.
        
        Args:
            db_manager: Gerenciador de conexão com o banco de dados
        """
        self.db = db_manager
        self.document_repo = DocumentProcessedRepository(db_manager)
    
    
    async def get_user_documents(self, user_id: UUID) -> List[Dict[str, Any]]:
        """
        Obtém todos os documentos processados de um usuário.
        
        Args:
            user_id: ID do usuário
            
        Returns:
            Lista de documentos processados
        """
        try:
            logger.info(f"Buscando documentos processados para usuário {user_id}")
            
            documents = await self.document_repo.get_user_documents(user_id)
            
            # Remover o conteúdo base64 para reduzir o tamanho da resposta
            for doc in documents:
                if "file_content_base64" in doc:
                    del doc["file_content_base64"]
            
            return documents
        except Exception as e:
            logger.error(f"Erro ao buscar documentos para usuário {user_id}: {str(e)}")
            raise
    
    async def get_document(self, document_id: UUID) -> Dict[str, Any]:
        """
        Obtém um documento processado pelo ID.
        
        Args:
            document_id: ID do documento
            
        Returns:
            Documento processado
            
        Raises:
            ValueError: Se o documento não for encontrado
        """
        try:
            logger.info(f"Buscando documento {document_id}")
            
            document = await self.document_repo.get_document(document_id)
            
            if not document:
                logger.error(f"Documento {document_id} não encontrado")
                raise ValueError(f"Documento {document_id} não encontrado")
            
            # Remover o conteúdo base64 para reduzir o tamanho da resposta
            if "file_content_base64" in document:
                del document["file_content_base64"]
            
            return document
        except ValueError:
            # Repassa exceções de valor
            raise
        except Exception as e:
            logger.error(f"Erro ao buscar documento {document_id}: {str(e)}")
            raise
    
    async def semantic_search(self, user_id: UUID, query: str, limit: int = 5) -> Dict[str, Any]:
        """
        Realiza uma pesquisa semântica nos documentos vetorizados de um usuário.
        
        Args:
            user_id: ID do usuário
            query: Texto da consulta
            limit: Número máximo de resultados
            
        Returns:
            Resultados da pesquisa semântica
        """
        try:
            logger.info(f"Realizando pesquisa semântica para usuário {user_id}: '{query}'")
            
            # Obter a coleção do usuário
            collection = get_collection(client=client, client_id=str(user_id))
            
            # Realizar pesquisa
            results = collection.query(
                query_texts=[f"query: {query}"],
                n_results=limit,
                include=["documents", "metadatas", "distances"]
            )
            
            # Formatar resultados
            formatted_results = []
            
            if results["documents"] and len(results["documents"]) > 0:
                for i, doc in enumerate(results["documents"][0]):
                    metadata = results["metadatas"][0][i] if i < len(results["metadatas"][0]) else {}
                    distance = results["distances"][0][i] if i < len(results["distances"][0]) else 1.0
                    
                    # Remover o prefixo "passage: " do documento
                    doc_text = doc.replace("passage: ", "") if doc.startswith("passage: ") else doc
                    
                    formatted_results.append({
                        "text": doc_text,
                        "metadata": metadata,
                        "relevance_score": 1.0 - distance  # Converter distância em score de relevância
                    })
            
            return {
                "success": True,
                "user_id": str(user_id),
                "query": query,
                "result_count": len(formatted_results),
                "results": formatted_results
            }
            
        except Exception as e:
            logger.error(f"Erro ao realizar pesquisa semântica: {str(e)}")
            raise
    
    async def delete_document(self, document_id: UUID) -> Dict[str, Any]:
        """
        Exclui um documento processado.
        
        Args:
            document_id: ID do documento
            
        Returns:
            Status da operação
        """
        try:
            logger.info(f"Excluindo documento {document_id}")
            
            # Verificar se o documento existe
            document = await self.document_repo.get_document(document_id)
            
            if not document:
                logger.error(f"Documento {document_id} não encontrado para exclusão")
                raise ValueError(f"Documento {document_id} não encontrado")
            
            # Excluir do banco de dados
            await self.document_repo.delete_document(document_id)
            
            # Nota: A exclusão dos dados vetorizados precisaria de uma implementação adicional
            # porque o ChromaDB não possui uma API para excluir documentos específicos de uma coleção
            # sem conhecer os IDs internos. Uma solução seria armazenar os IDs do ChromaDB no banco.
            
            return {
                "success": True,
                "message": f"Documento {document_id} excluído com sucesso",
                "document_id": str(document_id)
            }
            
        except ValueError:
            # Repassa exceções de valor
            raise
        except Exception as e:
            logger.error(f"Erro ao excluir documento {document_id}: {str(e)}")
            raise