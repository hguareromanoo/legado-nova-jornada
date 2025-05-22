from uuid import UUID
from typing import Dict, List, Any, Optional
from models.pydantic_models import Session, ConversationMessage, ClientProfile
from database.repositories.session_repository import SessionRepository
from database.repositories.message_repository import MessageRepository
from database.manager import SupabaseManager
from services.profile_service import ProfileService
from datetime import datetime
import logging

# Configurar logging
logger = logging.getLogger("service.session")

class SessionService:
    """
    Serviço para gerenciamento de sessões de onboarding.
    Implementa lógica de negócio relacionada a sessões e conversas.
    """
    
    def __init__(self, db_manager: SupabaseManager, profile_service: ProfileService):
        """
        Inicializa o serviço de sessões.
        
        Args:
            db_manager: Gerenciador de conexão com o banco de dados
            profile_service: Serviço de perfis
        """
        self.db = db_manager
        self.session_repo = SessionRepository(db_manager)
        self.message_repo = MessageRepository(db_manager)
        self.profile_service = profile_service
    
    
    async def create_session(self, user_id: UUID, session_id: Optional[UUID] = None) -> Session:
        """
        Cria uma nova sessão ou retorna uma sessão ativa existente.
        
        Args:
            user_id: ID do usuário (obrigatório)
            session_id: ID específico de sessão para recuperar (opcional)
            
        Returns:
            Sessão criada ou existente
        """
        try:
            if not user_id:
                raise ValueError("user_id é obrigatório para criar uma sessão")
                
            logger.info(f"Criando nova sessão para usuário {user_id}")
            
            # Se um session_id for fornecido, tentar recuperar essa sessão específica
            if session_id:
                logger.info(f"Tentando recuperar sessão específica {session_id}")
                existing_session = await self.session_repo.get_active_session(user_id, session_id)
                if existing_session:
                    logger.info(f"Sessão específica encontrada: {existing_session['session_id']}")
                    return await self.get_session_with_profile(UUID(existing_session["session_id"]))
            
            # Verifica se há uma sessão ativa para este usuário
            existing_session = await self.session_repo.get_active_session(user_id)
            if existing_session:
                logger.info(f"Sessão ativa encontrada: {existing_session['session_id']}")
                # Retorna sessão existente
                return await self.get_session_with_profile(UUID(existing_session["session_id"]))
            
            # Cria um novo perfil
            logger.info(f"Criando novo perfil para usuário {user_id}")
            profile = await self.profile_service.create_profile(user_id)
            
            # Cria uma nova sessão
            logger.info(f"Criando nova sessão com perfil {profile.profile_id}")
            session_id = await self.session_repo.create_session(user_id, profile.profile_id)
            logger.info(f"Nova sessão criada: {session_id}")
            
            # Adiciona mensagem de boas-vindas
            welcome_message = (
                "Olá! Sou o assistente virtual da consultoria patrimonial. "
                "Vou ajudá-lo a iniciar o processo de estruturação da sua holding patrimonial. "
                "Vamos conversar sobre seus objetivos e patrimônio para preparar sua reunião com nossos consultores. "
                "Podemos começar? Por favor, me diga seu nome completo."
            )
            
            await self.add_message(
                session_id=session_id,
                role="assistant",
                content=welcome_message
            )
            
            # Retorna sessão completa
            return await self.get_session_with_profile(session_id)
        except Exception as e:
            logger.error(f"Erro ao criar sessão: {str(e)}")
            raise
        
    async def get_session_with_profile(self, session_id: UUID) -> Session:
        """
        Obtém uma sessão com seu perfil e histórico de conversa.
        
        Args:
            session_id: ID da sessão
            
        Returns:
            Sessão completa
            
        Raises:
            ValueError: Se a sessão não for encontrada
        """
        try:
            logger.info(f"Buscando sessão: {session_id}")
            
            # Obtém dados da sessão
            session_data = await self.session_repo.get_session(session_id)
            if not session_data:
                logger.error(f"Sessão {session_id} não encontrada")
                raise ValueError(f"Sessão {session_id} não encontrada")
            
            # Obtém perfil
            profile = await self.profile_service.get_complete_profile(UUID(session_data["profile_id"]))
            
            # Obtém mensagens
            messages_data = await self.message_repo.get_messages(session_id)
            
            # Constrói histórico de conversa
            conversation_history = []
            for msg_data in messages_data:
                conversation_history.append(ConversationMessage(
                    message_id=UUID(msg_data["message_id"]),
                    session_id=UUID(msg_data["session_id"]),
                    timestamp=datetime.fromisoformat(msg_data["timestamp"]) if msg_data.get("timestamp") else datetime.now(),
                    role=msg_data["role"],
                    content=msg_data["content"],
                    extracted_entities=msg_data.get("extracted_entities")
                ))
            
            # Constrói sessão completa
            return Session(
                session_id=UUID(session_data["session_id"]),
                user_id=UUID(session_data["user_id"]) if session_data.get("user_id") else None,
                created_at=datetime.fromisoformat(session_data["created_at"]) if session_data.get("created_at") else datetime.now(),
                updated_at=datetime.fromisoformat(session_data["updated_at"]) if session_data.get("updated_at") else datetime.now(),
                is_active=session_data["is_active"],
                is_complete=session_data["is_complete"],
                completion_percentage=session_data["completion_percentage"],
                profile=profile,
                current_step=session_data.get("current_step"),
                last_page=session_data.get("last_page"),
                conversation_history=conversation_history
            )
        except ValueError as e:
            # Repassa exceções de valor
            raise
        except Exception as e:
            logger.error(f"Erro ao buscar sessão {session_id}: {str(e)}")
            raise
    
    async def add_message(self, session_id: UUID, role: str, content: str, 
                         extracted_entities: Optional[Dict[str, Any]] = None) -> ConversationMessage:
        """
        Adiciona uma mensagem ao histórico de conversa.
        
        Args:
            session_id: ID da sessão
            role: Papel do emissor (user ou assistant)
            content: Conteúdo da mensagem
            extracted_entities: Entidades extraídas (opcional)
            
        Returns:
            Mensagem adicionada
        """
        try:
            logger.info(f"Adicionando mensagem à sessão {session_id}")
            
            # Adiciona mensagem
            message_id = await self.message_repo.add_message(session_id, role, content, extracted_entities)
            
            # Atualiza timestamp da sessão
            await self.session_repo.update_timestamp(session_id)
            
            # Obtém mensagem
            message_data = await self.message_repo.get_message(message_id)
            
            # Constrói objeto de mensagem
            return ConversationMessage(
                message_id=UUID(message_data["message_id"]),
                session_id=UUID(message_data["session_id"]),
                timestamp=datetime.fromisoformat(message_data["timestamp"]) if message_data.get("timestamp") else datetime.now(),
                role=message_data["role"],
                content=message_data["content"],
                extracted_entities=message_data.get("extracted_entities")
            )
        except Exception as e:
            logger.error(f"Erro ao adicionar mensagem à sessão {session_id}: {str(e)}")
            raise
    
    async def update_session_progress(self, session_id: UUID, completion_percentage: float) -> None:
        """
        Atualiza o progresso de uma sessão.
        
        Args:
            session_id: ID da sessão
            completion_percentage: Percentual de conclusão
        """
        try:
            logger.info(f"Atualizando progresso da sessão {session_id}: {completion_percentage:.2f}%")
            
            await self.session_repo.update_progress(session_id, completion_percentage)
            
            # Marca como concluída se o progresso for suficiente
            if completion_percentage >= 0.8:
                logger.info(f"Marcando sessão {session_id} como concluída")
                await self.session_repo.mark_as_complete(session_id)
        except Exception as e:
            logger.error(f"Erro ao atualizar progresso da sessão {session_id}: {str(e)}")
            raise
    
    async def update_session_state(self, session_id: UUID, current_step: str, 
                                 last_page: Optional[str] = None) -> None:
        """
        Atualiza o estado de uma sessão.
        
        Args:
            session_id: ID da sessão
            current_step: Etapa atual
            last_page: Última página visitada (opcional)
        """
        try:
            logger.info(f"Atualizando estado da sessão {session_id}: {current_step}")
            
            await self.session_repo.update_state(session_id, current_step, last_page)
        except Exception as e:
            logger.error(f"Erro ao atualizar estado da sessão {session_id}: {str(e)}")
            raise
