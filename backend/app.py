from fastapi import FastAPI, HTTPException, Depends, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
import uvicorn
import json
import logging
# ADICIONAR no topo do app.py:
from datetime import datetime

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("app")

# Importações dos modelos e serviços
from models.pydantic_models import ClientProfile, ConversationMessage, Session
from database.manager import SupabaseManager
from services.profile_service import ProfileService
from services.session_service import SessionService
from agents.conversation import conversation_agent
from agents.conversation_db import prepare_conversation_agent_context, save_agent_response
from agents.extraction import extraction_agent
from agents.extraction_db import prepare_extraction_agent_context, process_extraction_result

# Verificar variáveis de ambiente
import os
from dotenv import load_dotenv

load_dotenv()

# Verificar se as credenciais do Supabase estão configuradas
if not os.getenv("SUPABASE_URL") or not os.getenv("SUPABASE_KEY"):
    print("\n⚠️  ATENÇÃO: Credenciais do Supabase não encontradas!")
    print("Por favor, configure SUPABASE_URL e SUPABASE_KEY no arquivo .env")
    exit(1)

app = FastAPI(title="Chat Onboarding API")

# Adicionar middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://preview--legado-nova-jornada.lovable.app", "http://localhost:3000", "http://localhost:8080", "https://legado-nova-jornada.lovable.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Inicializar serviços
db_manager = SupabaseManager()
profile_service = ProfileService(db_manager)
session_service = SessionService(db_manager, profile_service)

# Importações adicionais para o novo endpoint
from uuid import uuid4
import base64
import os
import tempfile
import json
from services.document_service import DocumentService

# Model para upload de documento
class DocumentUploadRequest(BaseModel):
    user_id: str
    document_key: str
    file_content_base64: str
    file_name: Optional[str] = None

# Inicializar serviço de documentos
document_service = DocumentService(db_manager)

# Endpoint para processamento de documentos
@app.post("/documents/process")
async def process_document(request: DocumentUploadRequest):
    """
    Processa um documento enviado em base64, realiza extração de dados e vetorização.
    
    Args:
        request: Request contendo user_id, document_key e arquivo em base64
        
    Returns:
        Detalhes do processamento do documento e dados extraídos
    """
    try:
        # Converter user_id para UUID
        user_id = UUID(request.user_id)
        
        logger.info(f"Iniciando processamento de documento para usuário {user_id}")
        
        # Verificar se existe uma sessão ativa para o usuário
        session = await session_service.session_repo.get_active_session(user_id)
        if not session:
            logger.error(f"Nenhuma sessão ativa encontrada para o usuário {user_id}")
            raise HTTPException(
                status_code=400,
                detail="Você precisa ter uma sessão ativa para processar documentos. Inicie o onboarding primeiro."
            )
        
        # Utiliza o serviço de documentos para processamento
        result = await document_service.process_document(
            user_id=user_id,
            document_key=request.document_key,
            file_content_base64=request.file_content_base64,
            file_name=request.file_name
        )
        
        return result
        
    except ValueError as e:
        logger.error(f"Erro de validação: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Erro ao processar documento: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para listar documentos de um usuário
@app.get("/users/{user_id}/documents")
async def get_user_documents(user_id: UUID):
    """
    Obtém a lista de documentos processados para um usuário.
    
    Args:
        user_id: ID do usuário
        
    Returns:
        Lista de documentos processados
    """
    try:
        logger.info(f"Buscando documentos processados para usuário {user_id}")
        
        documents = await document_service.get_user_documents(user_id)
        
        return {
            "success": True,
            "user_id": str(user_id),
            "document_count": len(documents),
            "documents": documents
        }
        
    except Exception as e:
        logger.error(f"Erro ao buscar documentos para usuário {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para obter um documento específico
@app.get("/documents/{document_id}")
async def get_document(document_id: UUID):
    """
    Obtém detalhes de um documento processado.
    
    Args:
        document_id: ID do documento
        
    Returns:
        Detalhes do documento processado
    """
    try:
        logger.info(f"Buscando documento {document_id}")
        
        document = await document_service.get_document(document_id)
        
        return {
            "success": True,
            "document": document
        }
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Erro ao buscar documento {document_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para pesquisa semântica em documentos
@app.post("/documents/search")
async def search_documents(user_id: UUID, query: str = Body(..., embed=True), limit: int = 5):
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
        
        results = await document_service.semantic_search(
            user_id=user_id,
            query=query,
            limit=limit
        )
        
        return results
        
    except Exception as e:
        logger.error(f"Erro ao realizar pesquisa semântica: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para excluir um documento
@app.delete("/documents/{document_id}")
async def delete_document(document_id: UUID):
    """
    Exclui um documento processado.
    
    Args:
        document_id: ID do documento
        
    Returns:
        Status da operação
    """
    try:
        logger.info(f"Excluindo documento {document_id}")
        
        result = await document_service.delete_document(document_id)
        
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Erro ao excluir documento {document_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
# Inicializar banco de dados na inicialização do app
@app.on_event("startup")
async def startup_event():
    await db_manager.initialize()

# Fechar conexões na finalização do app
@app.on_event("shutdown")
async def shutdown_event():
    await db_manager.close()

# Model para request de criação de sessão
class SessionRequest(BaseModel):
    user_id: str

# Model para mensagem do usuário
class UserMessage(BaseModel):
    content: str

# Model para resposta do assistente
class AssistantResponse(BaseModel):
    content: str
    profile: ClientProfile
    completion_percentage: float
    is_complete: bool

@app.get("/")
async def root():
    """Rota raiz da API."""
    return {"message": "Chat Onboarding API para Consultoria Patrimonial"}

@app.post("/sessions")
async def create_session(request: SessionRequest):
    """
    Cria uma nova sessão ou recupera uma sessão existente para o usuário.
    """
    try:
        # Converter user_id para UUID
        user_id = UUID(request.user_id)
        
        # Criar ou recuperar sessão
        logger.info(f"Criando sessão para usuário {user_id}")
        session = await session_service.create_session(user_id)
        
        return session
    except ValueError as e:
        logger.error(f"Erro de validação: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Erro ao criar sessão: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sessions/{session_id}")
async def get_session(session_id: UUID):
    """Obtém informações de uma sessão existente."""
    try:
        return await session_service.get_session_with_profile(session_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Erro ao buscar sessão {session_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sessions/{session_id}/messages")
async def send_message(session_id: UUID, message: UserMessage):
    """Envia uma mensagem do usuário e obtém resposta do assistente."""
    try:
        # Verificar se a sessão existe
        session = await session_service.get_session_with_profile(session_id)
        
        # Preparar contexto para o agente de extração
        ext_deps = await prepare_extraction_agent_context(
            profile_service=profile_service,
            session_id=session_id,
            profile_id=session.profile.profile_id
        )
        
        # Extrair entidades da resposta
        extraction_result = await extraction_agent.run(message.content, deps=ext_deps)
        extraction_output = extraction_result.output
        
        # Processar resultado da extração e atualizar banco
        updated_profile = await process_extraction_result(
            profile_service=profile_service,
            session_service=session_service,
            session_id=session_id,
            user_input=message.content,
            extraction_output=extraction_output
        )
        
        # Preparar contexto para o agente de conversação
        conv_deps = await prepare_conversation_agent_context(
            session_service=session_service,
            session_id=session_id
        )
        
        # Determinar próxima pergunta
        next_question_result = await conversation_agent.run(
            "Determine a próxima pergunta apropriada.", 
            deps=conv_deps
        )
        next_question = next_question_result.output
        
        # Salvar resposta do agente no banco
        await save_agent_response(
            session_service=session_service,
            session_id=session_id,
            next_question=next_question
        )
        
        # Obter sessão atualizada
        updated_session = await session_service.get_session_with_profile(session_id)

        logger.info(f"""======================!!!!!================================\n\n
                    
                    
                    Enviando resposta para o frontend: {next_question.question}""")
        return AssistantResponse(
            content=next_question.question,
            profile=updated_session.profile,
            completion_percentage=updated_session.completion_percentage,
            is_complete=updated_session.is_complete
        )
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Erro ao processar mensagem: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sessions/{session_id}/messages")
async def get_messages(session_id: UUID):
    """Obtém o histórico de mensagens de uma sessão."""
    try:
        session = await session_service.get_session_with_profile(session_id)
        return session.conversation_history
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Erro ao buscar mensagens: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para debug
@app.post("/debug/request")
async def debug_request(request: Request):
    """Endpoint para debug de requisições."""
    body = await request.body()
    headers = dict(request.headers)
    
    return {
        "method": request.method,
        "url": str(request.url),
        "headers": headers,
        "body": body.decode() if body else None
    }

# Adicionar no app.py

from pydantic import BaseModel
from typing import List, Optional

# Model para resposta das recomendações
class DocumentRecommendationsResponse(BaseModel):
    success: bool
    session_id: str
    profile_completion: float
    is_complete: bool
    total_documents: int
    mandatory_documents: int
    recommendations: List[dict]
    summary: dict
    metadata: dict

@app.get("/sessions/{session_id}/document-recommendations")
async def get_document_recommendations(session_id: UUID):
    """
    Obtém recomendações de documentos quando perfil está completo.
    
    Args:
        session_id: ID da sessão
        
    Returns:
        Lista de documentos recomendados com chaves para OCR
    """
    try:
        logger.info(f"Buscando recomendações de documentos para sessão {session_id}")
        
        # Buscar sessão completa
        session = await session_service.get_session_with_profile(session_id)
        
        # Verificar se perfil está completo
        if not session.is_complete:
            logger.warning(f"Tentativa de buscar documentos para sessão incompleta: {session_id}")
            raise HTTPException(
                status_code=400, 
                detail={
                    "error": "Perfil ainda não está completo",
                    "completion_percentage": session.completion_percentage,
                    "is_complete": session.is_complete
                }
            )
        
        logger.info(f"Perfil completo confirmado. Gerando recomendações...")
        
        # Gerar recomendações de documentos
        recommendations = await profile_service.recommend_documents(session.profile.profile_id)
        
        # Calcular estatísticas
        total_documents = len(recommendations)
        mandatory_documents = sum(1 for rec in recommendations if rec.is_mandatory)
        
        # Agrupar por categoria para resumo
        categories_summary = {}
        for rec in recommendations:
            category = rec.category.value
            if category not in categories_summary:
                categories_summary[category] = 0
            categories_summary[category] += 1
        
        # Calcular custo estimado total
        total_cost = 0
        cost_count = 0
        for rec in recommendations:
            if rec.estimated_cost and 'R$' in rec.estimated_cost:
                try:
                    cost_str = rec.estimated_cost.replace('R$', '').strip()
                    if '-' in cost_str:
                        low, high = map(float, cost_str.split('-'))
                        avg_cost = (low + high) / 2
                    else:
                        avg_cost = float(cost_str)
                    total_cost += avg_cost
                    cost_count += 1
                except:
                    pass
        
        estimated_total_cost = f"R$ {total_cost:.0f}" if cost_count > 0 else "Não informado"
        
        # Contar itens específicos analisados
        real_estate_count = len([a for a in session.profile.assets if a.asset_type.value == "imóvel"])
        company_count = len([a for a in session.profile.assets if a.asset_type.value == "empresa"])
        rural_count = len([a for a in session.profile.assets if a.asset_type.value == "propriedade rural"])
        family_count = len(session.profile.family_members)
        
        # Preparar resposta
        response_data = DocumentRecommendationsResponse(
            success=True,
            session_id=str(session_id),
            profile_completion=session.completion_percentage,
            is_complete=session.is_complete,
            total_documents=total_documents,
            mandatory_documents=mandatory_documents,
            recommendations=[rec.model_dump() for rec in recommendations],
            summary={
                "by_category": categories_summary,
                "estimated_total_cost": estimated_total_cost,
                "processing_time_range": "Imediato até 10 dias úteis",
                "priority_distribution": {
                    "alta_prioridade": len([r for r in recommendations if r.priority >= 5]),
                    "media_prioridade": len([r for r in recommendations if r.priority == 4]),
                    "baixa_prioridade": len([r for r in recommendations if r.priority <= 3])
                }
            },
            metadata={
                "profile_id": str(session.profile.profile_id),
                "generated_at": datetime.now().isoformat(),
                "client_name": session.profile.personal_info.name,
                "marital_status": session.profile.personal_info.marital_status.value if session.profile.personal_info.marital_status else None,
                "items_analyzed": {
                    "imoveis": real_estate_count,
                    "empresas": company_count,
                    "propriedades_rurais": rural_count,
                    "membros_familia": family_count
                },
                "document_keys_generated": [rec.document_key for rec in recommendations]
            }
        )
        
        logger.info(f"Recomendações geradas com sucesso: {total_documents} documentos para sessão {session_id}")
        return response_data
        
    except HTTPException:
        # Re-raise HTTP exceptions (como perfil incompleto)
        raise
    except ValueError as e:
        logger.error(f"Sessão não encontrada: {session_id}")
        raise HTTPException(status_code=404, detail=f"Sessão não encontrada: {str(e)}")
    except Exception as e:
        logger.error(f"Erro ao buscar recomendações para sessão {session_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

# Endpoint adicional para verificar status da sessão
@app.get("/sessions/{session_id}/completion-status")
async def get_completion_status(session_id: UUID):
    """
    Verifica o status de completude de uma sessão.
    
    Args:
        session_id: ID da sessão
        
    Returns:
        Status de completude da sessão
    """
    try:
        session = await session_service.get_session_with_profile(session_id)
        
        return {
            "success": True,
            "session_id": str(session_id),
            "is_complete": session.is_complete,
            "completion_percentage": session.completion_percentage,
            "profile": {
                "personal_completion": session.profile.completion_score.personal,
                "family_completion": session.profile.completion_score.family,
                "assets_completion": session.profile.completion_score.assets,
                "goals_completion": session.profile.completion_score.goals,
                "overall_completion": session.profile.completion_score.overall
            },
            "ready_for_documents": session.is_complete,
            "next_step": "document_upload" if session.is_complete else "continue_chat"
        }
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Erro ao verificar status da sessão {session_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para debug - listar todas as chaves de documentos possíveis
@app.get("/document-keys")
async def get_document_keys():
    """
    Lista todas as chaves de documentos possíveis para debug/desenvolvimento.
    
    Returns:
        Dicionário com todas as chaves e descrições
    """
    try:
        # Mapeamento das chaves básicas
        basic_keys = {
            "rg": "RG - Registro Geral",
            "cpf": "CPF - Cadastro de Pessoa Física",
            "comprovante_residencia": "Comprovante de Residência",
            "certidao_nascimento": "Certidão de Nascimento",
            "certidao_casamento": "Certidão de Casamento",
            "certidao_regime_bens": "Certidão de Regime de Bens",
            "contrato_uniao_estavel": "Contrato de União Estável",
            "certidao_divorcio_obito": "Certidão de Divórcio/Óbito",
            "extrato_investimentos": "Extrato de Investimentos",
            "declaracao_ir": "Declaração de Imposto de Renda",
            "declaracao_bens": "Declaração de Bens dos Sócios",
            "dados_contador": "Dados do Contador Responsável"
        }
        
        # Chaves que podem ser numeradas
        numbered_keys = {
            "certidao_nascimento_filho_X": "Certidão de Nascimento do Filho (numerado)",
            "matricula_imovel_X": "Matrícula do Imóvel (numerado)",
            "certidao_onus_reais_X": "Certidão de Ônus Reais (numerado)",
            "certidao_iptu_X": "Certidão IPTU (numerado)",
            "ccir_X": "CCIR Rural (numerado)",
            "contrato_social_X": "Contrato Social da Empresa (numerado)",
            "balanco_patrimonial_X": "Balanço Patrimonial (numerado)",
            "prova_titularidade_cotas_X": "Prova de Titularidade (numerado)"
        }
        
        return {
            "success": True,
            "basic_document_keys": basic_keys,
            "numbered_document_keys": numbered_keys,
            "note": "Chaves numeradas substituem X pelo número do item (ex: matricula_imovel_1, matricula_imovel_2)",
            "total_possible_combinations": "Ilimitado (baseado no número de itens do cliente)"
        }
   
    except Exception as e:
        logger.error(f"Erro ao listar chaves de documentos: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("\n🏢 Iniciando API do Chat Onboarding para Consultoria Patrimonial...\n")
    print("A API estará disponível em http://localhost:8000")
    print("Acesse a documentação em http://localhost:8000/docs\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)


