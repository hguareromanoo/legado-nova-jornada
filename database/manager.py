import os
import time
import logging
import asyncio
from typing import Dict, Any, Optional, List
from supabase import create_client, Client
from dotenv import load_dotenv

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("database_manager")

class SupabaseManager:
    """
    Gerenciador de conexão com o Supabase com recursos de resiliência e reconexão.
    """
    def __init__(self, max_retries: int = 3, retry_delay: float = 1.0):
        """
        Inicializa o gerenciador de conexão com o Supabase.
        
        Args:
            max_retries: Número máximo de tentativas de reconexão
            retry_delay: Tempo de espera entre tentativas (em segundos)
        """
        load_dotenv()
        self.url = os.getenv("SUPABASE_URL", "")
        self.key = os.getenv("SUPABASE_KEY", "")
        self.service_key = os.getenv("SUPABASE_SERVICE_KEY", "")
        self.client: Optional[Client] = None
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.initialized = False
        
        # Verificar se as credenciais estão configuradas
        if not self.url or not self.key:
            logger.error("Credenciais do Supabase não configuradas. Verifique as variáveis de ambiente.")
    
   # Ajuste no método initialize
    async def initialize(self) -> None:
        """Inicializa a conexão com o Supabase."""
        if not self.url or not self.key:
            raise ValueError("Credenciais do Supabase não configuradas. Verifique as variáveis de ambiente.")
        
        try:
            logger.info("Inicializando conexão com o Supabase...")
            # Usar a chave de serviço se disponível, caso contrário usar a chave pública
            # A chave de serviço ignora RLS e é necessária para operações administrativas
            key_to_use = self.service_key if self.service_key else self.key
            self.client = create_client(self.url, key_to_use)
            self.initialized = True
            logger.info("Conexão com o Supabase inicializada com sucesso.")
        except Exception as e:
            logger.error(f"Erro ao inicializar conexão com o Supabase: {str(e)}")
            raise

    async def close(self) -> None:
        """
        Fecha a conexão com o Supabase.
        """
        logger.info("Fechando conexão com o Supabase...")
        self.initialized = False
        self.client = None
    
    async def ensure_connection(self) -> None:
        """
        Garante que a conexão com o Supabase está ativa.
        """
        if not self.initialized or not self.client:
            await self.initialize()
    
    async def execute_with_retry(self, operation_func, *args, **kwargs) -> Any:
        """
        Executa uma operação com retry em caso de falha.
        
        Args:
            operation_func: Função a ser executada
            *args: Argumentos posicionais para a função
            **kwargs: Argumentos nomeados para a função
            
        Returns:
            Resultado da operação
            
        Raises:
            Exception: Se todas as tentativas falharem
        """
        await self.ensure_connection()
        
        last_error = None
        for attempt in range(1, self.max_retries + 1):
            try:
                return await operation_func(*args, **kwargs)
            except Exception as e:
                last_error = e
                logger.warning(f"Tentativa {attempt}/{self.max_retries} falhou: {str(e)}")
                
                if attempt < self.max_retries:
                    # Espera exponencial entre tentativas
                    wait_time = self.retry_delay * (2 ** (attempt - 1))
                    logger.info(f"Aguardando {wait_time:.2f}s antes da próxima tentativa...")
                    await asyncio.sleep(wait_time)
                    
                    # Tenta reinicializar a conexão
                    try:
                        await self.close()
                        await self.initialize()
                    except Exception as init_error:
                        logger.error(f"Erro ao reinicializar conexão: {str(init_error)}")
        
        # Se chegou aqui, todas as tentativas falharam
        logger.error(f"Todas as {self.max_retries} tentativas falharam. Último erro: {str(last_error)}")
        raise last_error
    
    # Métodos de acesso ao banco de dados com retry
    
    async def select(self, table: str, columns: str = "*", filters: Optional[Dict[str, Any]] = None, 
                    order: Optional[str] = None, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Executa uma consulta SELECT com retry.
        
        Args:
            table: Nome da tabela
            columns: Colunas a serem selecionadas
            filters: Filtros para a consulta
            order: Ordenação dos resultados
            limit: Limite de resultados
            
        Returns:
            Lista de registros encontrados
        """
        async def _operation():
            query = self.client.table(table).select(columns)
            
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            if order:
                query = query.order(order)
            
            if limit:
                query = query.limit(limit)
            
            response = query.execute()
            
            if hasattr(response, 'error') and response.error:
                raise Exception(f"Erro na consulta: {response.error.message}")
            
            return response.data
        
        return await self.execute_with_retry(_operation)
    
    async def insert(self, table: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executa uma operação INSERT com retry.
        
        Args:
            table: Nome da tabela
            data: Dados a serem inseridos
            
        Returns:
            Registro inserido
        """
        async def _operation():
            response = self.client.table(table).insert(data).execute()
            
            if hasattr(response, 'error') and response.error:
                raise Exception(f"Erro na inserção: {response.error.message}")
            
            return response.data[0] if response.data else {}
        
        return await self.execute_with_retry(_operation)
    
    async def update(self, table: str, data: Dict[str, Any], filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Executa uma operação UPDATE com retry.
        
        Args:
            table: Nome da tabela
            data: Dados a serem atualizados
            filters: Filtros para identificar os registros a serem atualizados
            
        Returns:
            Registros atualizados
        """
        async def _operation():
            query = self.client.table(table).update(data)
            
            for key, value in filters.items():
                query = query.eq(key, value)
            
            response = query.execute()
            
            if hasattr(response, 'error') and response.error:
                raise Exception(f"Erro na atualização: {response.error.message}")
            
            return response.data
        
        return await self.execute_with_retry(_operation)
    
    async def delete(self, table: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Executa uma operação DELETE com retry.
        
        Args:
            table: Nome da tabela
            filters: Filtros para identificar os registros a serem excluídos
            
        Returns:
            Registros excluídos
        """
        async def _operation():
            query = self.client.table(table).delete()
            
            for key, value in filters.items():
                query = query.eq(key, value)
            
            response = query.execute()
            
            if hasattr(response, 'error') and response.error:
                raise Exception(f"Erro na exclusão: {response.error.message}")
            
            return response.data
        
        return await self.execute_with_retry(_operation)
    
    async def execute_rpc(self, function_name: str, params: Dict[str, Any]) -> Any:
        """
        Executa uma função RPC com retry.
        
        Args:
            function_name: Nome da função
            params: Parâmetros para a função
            
        Returns:
            Resultado da função
        """
        async def _operation():
            response = self.client.rpc(function_name, params).execute()
            
            if hasattr(response, 'error') and response.error:
                raise Exception(f"Erro na execução da função RPC: {response.error.message}")
            
            return response.data
        
        return await self.execute_with_retry(_operation)
    
    async def check_connection(self) -> bool:
        """
        Verifica se a conexão com o Supabase está funcionando.
        
        Returns:
            True se a conexão estiver funcionando, False caso contrário
        """
        try:
            # Tenta fazer uma consulta simples para verificar a conexão
            await self.select("client_profiles", limit=1)
            return True
        except Exception as e:
            logger.error(f"Erro ao verificar conexão: {str(e)}")
            return False
        


