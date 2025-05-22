from uuid import UUID
from typing import Dict, List, Any, Optional
from database.manager import SupabaseManager
from database.base_repository import BaseRepository
import logging

logger = logging.getLogger("repository.session")

class SessionRepository(BaseRepository):
    """
    Repositório para operações relacionadas a sessões.
    """
    
    def __init__(self, db_manager: SupabaseManager):
        """
        Inicializa o repositório de sessões.
        
        Args:
            db_manager: Gerenciador de conexão com o banco de dados
        """
        super().__init__(db_manager, "sessions")
    
    async def create_session(self, user_id: Optional[UUID] = None, profile_id: Optional[UUID] = None) -> UUID:
        """
        Cria uma nova sessão.
        
        Args:
            user_id: ID do usuário (opcional)
            profile_id: ID do perfil (opcional)
            
        Returns:
            ID da sessão criada
        """
        try:
            data = {
                "is_active": True,
                "is_complete": False,
                "completion_percentage": 0.0
            }
            
            if user_id:
                data["user_id"] = str(user_id)
            
            if profile_id:
                data["profile_id"] = str(profile_id)
            
            result = await self.create(data)
            
            return UUID(result["session_id"])
        except Exception as e:
            logger.error(f"Erro ao criar sessão: {str(e)}")
            raise
    
    async def get_session(self, session_id: UUID) -> Optional[Dict[str, Any]]:
        """
        Obtém uma sessão pelo ID.
        
        Args:
            session_id: ID da sessão
            
        Returns:
            Dados da sessão ou None se não encontrada
        """
        return await self.find_by_id("session_id", str(session_id))
    
    # Implementação alternativa sem usar order
    async def get_active_session(self, user_id: UUID) -> Optional[Dict[str, Any]]:
        try:
            # Obter todas as sessões ativas do usuário
            sessions = await self.find_all(
                filters={
                    "user_id": str(user_id),
                    "is_active": True
                }
            )
            
            # Se não houver sessões, retornar None
            if not sessions:
                return None
            
            # Ordenar manualmente pelo timestamp mais recente
            sessions.sort(key=lambda x: x.get("created_at", ""), reverse=True)
            
            # Retornar a primeira sessão (mais recente)
            return sessions[0]
        except Exception as e:
            logger.error(f"Erro ao buscar sessão ativa para usuário {user_id}: {str(e)}")
            raise
    
    async def update_timestamp(self, session_id: UUID) -> None:
        """
        Atualiza o timestamp de uma sessão.
        
        Args:
            session_id: ID da sessão
        """
        try:
            await self.update(
                id_field="session_id",
                id_value=str(session_id),
                data={"updated_at": "now()"}
            )
        except Exception as e:
            logger.error(f"Erro ao atualizar timestamp da sessão {session_id}: {str(e)}")
            raise
    
    async def update_progress(self, session_id: UUID, completion_percentage: float) -> None:
        """
        Atualiza o progresso de uma sessão.
        
        Args:
            session_id: ID da sessão
            completion_percentage: Percentual de conclusão
        """
        try:
            await self.update(
                id_field="session_id",
                id_value=str(session_id),
                data={"completion_percentage": completion_percentage}
            )
        except Exception as e:
            logger.error(f"Erro ao atualizar progresso da sessão {session_id}: {str(e)}")
            raise
    
    async def mark_as_complete(self, session_id: UUID) -> None:
        """
        Marca uma sessão como concluída.
        
        Args:
            session_id: ID da sessão
        """
        try:
            await self.update(
                id_field="session_id",
                id_value=str(session_id),
                data={"is_complete": True}
            )
        except Exception as e:
            logger.error(f"Erro ao marcar sessão {session_id} como concluída: {str(e)}")
            raise
    
    async def update_state(self, session_id: UUID, current_step: str, 
                         last_page: Optional[str] = None) -> None:
        """
        Atualiza o estado de uma sessão.
        
        Args:
            session_id: ID da sessão
            current_step: Etapa atual
            last_page: Última página visitada (opcional)
        """
        try:
            data = {"current_step": current_step}
            
            if last_page:
                data["last_page"] = last_page
            
            await self.update(
                id_field="session_id",
                id_value=str(session_id),
                data=data
            )
        except Exception as e:
            logger.error(f"Erro ao atualizar estado da sessão {session_id}: {str(e)}")
            raise
