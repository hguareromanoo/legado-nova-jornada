import logging
from typing import Dict, Any, List, Optional, Type, TypeVar, Generic
from uuid import UUID
from database.manager import SupabaseManager

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

T = TypeVar('T')

class BaseRepository(Generic[T]):
    """
    Classe base para repositórios com funcionalidades comuns de acesso ao banco de dados.
    Implementa padrão de repositório para abstrair a camada de acesso a dados.
    """
    
    def __init__(self, db_manager: SupabaseManager, table_name: str):
        """
        Inicializa o repositório base.
        
        Args:
            db_manager: Gerenciador de conexão com o banco de dados
            table_name: Nome da tabela no banco de dados
        """
        self.db = db_manager
        self.table_name = table_name
        self.logger = logging.getLogger(f"repository.{table_name}")
    
    async def find_by_id(self, id_field: str, id_value: Any) -> Optional[Dict[str, Any]]:
        """
        Busca um registro pelo ID.
        
        Args:
            id_field: Nome do campo de ID
            id_value: Valor do ID
            
        Returns:
            Registro encontrado ou None
        """
        try:
            self.logger.debug(f"Buscando {self.table_name} com {id_field}={id_value}")
            results = await self.db.select(
                table=self.table_name,
                filters={id_field: id_value}
            )
            
            if not results:
                self.logger.debug(f"Nenhum registro encontrado para {id_field}={id_value}")
                return None
                
            return results[0]
        except Exception as e:
            self.logger.error(f"Erro ao buscar {self.table_name} com {id_field}={id_value}: {str(e)}")
            raise
    
    async def find_all(self, filters: Optional[Dict[str, Any]] = None, 
                      order: Optional[str] = None, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Busca todos os registros que correspondem aos filtros.
        
        Args:
            filters: Filtros para a consulta
            order: Ordenação dos resultados
            limit: Limite de resultados
            
        Returns:
            Lista de registros encontrados
        """
        try:
            filter_str = ", ".join([f"{k}={v}" for k, v in (filters or {}).items()])
            self.logger.debug(f"Buscando registros em {self.table_name} com filtros: {filter_str}")
            
            return await self.db.select(
                table=self.table_name,
                filters=filters,
                order=order,
                limit=limit
            )
        except Exception as e:
            self.logger.error(f"Erro ao buscar registros em {self.table_name}: {str(e)}")
            raise
    
    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Cria um novo registro."""
        try:
            self.logger.debug(f"Criando novo registro em {self.table_name}")
            return await self.db.insert(
                table=self.table_name,
                data=self._prepare_data(data)
            )
        except Exception as e:
            self.logger.error(f"Erro ao criar registro em {self.table_name}: {str(e)}")
            raise
    
    async def update(self, id_field: str, id_value: Any, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Atualiza um registro existente.
        
        Args:
            id_field: Nome do campo de ID
            id_value: Valor do ID
            data: Dados a serem atualizados
            
        Returns:
            Registro atualizado
        """
        try:
            self.logger.debug(f"Atualizando {self.table_name} com {id_field}={id_value}")
            results = await self.db.update(
                table=self.table_name,
                data=data,
                filters={id_field: id_value}
            )
            
            if not results:
                raise ValueError(f"Nenhum registro encontrado para atualização com {id_field}={id_value}")
                
            return results[0]
        except Exception as e:
            self.logger.error(f"Erro ao atualizar {self.table_name} com {id_field}={id_value}: {str(e)}")
            raise
    
    async def delete(self, id_field: str, id_value: Any) -> Dict[str, Any]:
        """
        Exclui um registro existente.
        
        Args:
            id_field: Nome do campo de ID
            id_value: Valor do ID
            
        Returns:
            Registro excluído
        """
        try:
            self.logger.debug(f"Excluindo {self.table_name} com {id_field}={id_value}")
            results = await self.db.delete(
                table=self.table_name,
                filters={id_field: id_value}
            )
            
            if not results:
                raise ValueError(f"Nenhum registro encontrado para exclusão com {id_field}={id_value}")
                
            return results[0]
        except Exception as e:
            self.logger.error(f"Erro ao excluir {self.table_name} com {id_field}={id_value}: {str(e)}")
            raise
    
    async def execute_rpc(self, function_name: str, params: Dict[str, Any]) -> Any:
        """
        Executa uma função RPC.
        
        Args:
            function_name: Nome da função
            params: Parâmetros para a função
            
        Returns:
            Resultado da função
        """
        try:
            self.logger.debug(f"Executando função RPC {function_name}")
            return await self.db.execute_rpc(function_name, params)
        except Exception as e:
            self.logger.error(f"Erro ao executar função RPC {function_name}: {str(e)}")
            raise
    def _prepare_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Prepara dados para inserção, convertendo UUIDs para strings."""
        processed = {}
        
        for key, value in data.items():
            if isinstance(value, UUID):
                processed[key] = str(value)
            else:
                processed[key] = value
                
        return processed

