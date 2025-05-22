from uuid import UUID
from typing import Dict, List, Any, Optional
from database.manager import SupabaseManager
from database.base_repository import BaseRepository
import logging

logger = logging.getLogger("repository.message")

class MessageRepository(BaseRepository):
    """
    Repositório para operações relacionadas a mensagens de conversação.
    """
    
    def __init__(self, db_manager: SupabaseManager):
        """
        Inicializa o repositório de mensagens.
        
        Args:
            db_manager: Gerenciador de conexão com o banco de dados
        """
        super().__init__(db_manager, "conversation_messages")
    
    async def add_message(self, session_id: UUID, role: str, content: str, 
                        extracted_entities: Optional[Dict[str, Any]] = None) -> UUID:
        """
        Adiciona uma nova mensagem à conversa.
        
        Args:
            session_id: ID da sessão
            role: Papel do emissor (user ou assistant)
            content: Conteúdo da mensagem
            extracted_entities: Entidades extraídas (opcional)
            
        Returns:
            ID da mensagem criada
        """
        try:
            data = {
                "session_id": str(session_id),
                "role": role,
                "content": content
            }
            
            if extracted_entities:
                data["extracted_entities"] = extracted_entities
            
            result = await self.create(data)
            
            return UUID(result["message_id"])
        except Exception as e:
            logger.error(f"Erro ao adicionar mensagem para sessão {session_id}: {str(e)}")
            raise
    
    async def get_message(self, message_id: UUID) -> Optional[Dict[str, Any]]:
        """
        Obtém uma mensagem pelo ID.
        
        Args:
            message_id: ID da mensagem
            
        Returns:
            Dados da mensagem ou None se não encontrada
        """
        return await self.find_by_id("message_id", str(message_id))
    
    async def get_messages(self, session_id: UUID) -> List[Dict[str, Any]]:
        """
        Obtém todas as mensagens de uma sessão.
        
        Args:
            session_id: ID da sessão
            
        Returns:
            Lista de mensagens
        """
        try:
            return await self.find_all(
                filters={"session_id": str(session_id)},
                order="timestamp"
            )
        except Exception as e:
            logger.error(f"Erro ao buscar mensagens para sessão {session_id}: {str(e)}")
            raise
    
    async def get_last_user_message(self, session_id: UUID) -> Optional[Dict[str, Any]]:
        """
        Obtém a última mensagem do usuário em uma sessão.
        
        Args:
            session_id: ID da sessão
            
        Returns:
            Dados da última mensagem do usuário ou None se não encontrada
        """
        try:
            results = await self.find_all(
                filters={
                    "session_id": str(session_id),
                    "role": "user"
                },
                order="timestamp.desc",
                limit=1
            )
            
            return results[0] if results else None
        except Exception as e:
            logger.error(f"Erro ao buscar última mensagem do usuário para sessão {session_id}: {str(e)}")
            raise
    
    async def get_last_assistant_message(self, session_id: UUID) -> Optional[Dict[str, Any]]:
        """
        Obtém a última mensagem do assistente em uma sessão.
        
        Args:
            session_id: ID da sessão
            
        Returns:
            Dados da última mensagem do assistente ou None se não encontrada
        """
        try:
            results = await self.find_all(
                filters={
                    "session_id": str(session_id),
                    "role": "assistant"
                },
                order="timestamp.desc",
                limit=1
            )
            
            return results[0] if results else None
        except Exception as e:
            logger.error(f"Erro ao buscar última mensagem do assistente para sessão {session_id}: {str(e)}")
            raise
