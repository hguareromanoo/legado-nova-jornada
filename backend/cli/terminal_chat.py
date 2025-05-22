import asyncio
from datetime import datetime
from uuid import uuid4
from typing import List, Dict, Any

from models.pydantic_models import (
    ClientProfile, ConversationMessage, Session,
    PersonalInfo, CompletionScore
)
from agents.conversation import conversation_agent, ConversationDependencies, NextQuestionOutput
from agents.extraction import extraction_agent, ExtractionOutput, ExtractionDependencies
from services.profile_service import ProfileService

async def run_chat_session():
    """Executa uma sessão de chat de onboarding com comunicação aprimorada entre agentes."""
    # Inicializar sessão e perfil
    session_id = uuid4()
    profile = ClientProfile(
        personal_info=PersonalInfo(),
        completion_score=CompletionScore()
    )
    session = Session(
        session_id=session_id,
        profile=profile
    )
    conversation_history: List[ConversationMessage] = []
    
    # Rastreamento de campos ausentes e feedback de extração
    missing_fields: Dict[str, List[str]] = {}
    extraction_confidence: float = 0.0
    last_extraction_updates: Dict[str, Any] = {}
    targeted_fields: List[str] = []
    
    # Mensagem de boas-vindas
    welcome_message = (
        "Olá! Sou o assistente virtual da consultoria patrimonial. "
        "Vou ajudá-lo a iniciar o processo de estruturação da sua holding patrimonial. "
        "Vamos conversar sobre seus objetivos e patrimônio para preparar sua reunião com nossos consultores. "
        "Podemos começar? Por favor, me diga seu nome completo."
    )
    print(f"\nAssistente: {welcome_message}\n")
    
    # Adicionar mensagem ao histórico
    conversation_history.append(
        ConversationMessage(
            session_id=session_id,
            role="assistant",
            content=welcome_message
        )
    )
    
    # Inicializar campos alvo para a primeira pergunta
    targeted_fields = ["nome"]
    
    # Loop principal de conversa
    while session.completion_percentage < 0.8 and not session.is_complete:
        # Obter resposta do usuário
        user_input = input("Você: ")
        
        # Adicionar resposta ao histórico
        conversation_history.append(
            ConversationMessage(
                session_id=session_id,
                role="user",
                content=user_input
            )
        )
        
        # Configurar dependências para o agente de extração
        extraction_deps = ExtractionDependencies()
        extraction_deps.current_profile = profile
        extraction_deps.section_focus = "personal" if not profile.personal_info.name else None
        extraction_deps.targeted_fields = targeted_fields
        
        # Extrair entidades da resposta
        extraction_result = await extraction_agent.run(user_input, deps=extraction_deps)
        extraction_output = extraction_result.output
        
        # Atualizar perfil com informações extraídas
        profile = update_profile(profile, extraction_output)
        session.profile = profile
        session.completion_percentage = profile.completion_score.overall
        
        # Capturar feedback e campos ausentes do extrator
        missing_fields = extraction_output.missing_fields if extraction_output.missing_fields else {}
        extraction_confidence = extraction_output.confidence_score
        
        # Rastrear atualizações da última extração
        last_extraction_updates = {}
        if extraction_output.personal_info_updates:
            last_extraction_updates["informações pessoais"] = extraction_output.personal_info_updates
        if extraction_output.family_members_updates:
            last_extraction_updates["familiares"] = f"{len(extraction_output.family_members_updates)} membro(s)"
        if extraction_output.assets_updates:
            last_extraction_updates["patrimônios"] = f"{len(extraction_output.assets_updates)} item(ns)"
        if extraction_output.goals_updates:
            last_extraction_updates["objetivos"] = f"{len(extraction_output.goals_updates)} objetivo(s)"
        if extraction_output.concerns_updates:
            last_extraction_updates["preocupações"] = f"{len(extraction_output.concerns_updates)} preocupação(ões)"
        
        # Configurar dependências para o agente de conversação
        conv_deps = ConversationDependencies()
        conv_deps.profile = profile
        conv_deps.conversation_history = conversation_history
        conv_deps.missing_fields = missing_fields
        conv_deps.extraction_confidence = extraction_confidence
        conv_deps.last_extraction_updates = last_extraction_updates
        
        # Determinar próxima pergunta
        next_question_result = await conversation_agent.run("Determine a próxima pergunta apropriada.", deps=conv_deps)
        next_question = next_question_result.output
        
        # Atualizar campos alvo para a próxima extração
        targeted_fields = next_question.targeted_fields if next_question.targeted_fields else []
        
        # Exibir próxima pergunta
        print(f"\nAssistente: {next_question.question}\n")
        
        # Adicionar pergunta ao histórico
        conversation_history.append(
            ConversationMessage(
                session_id=session_id,
                role="assistant",
                content=next_question.question
            )
        )
        
        # Exibir progresso
        print(f"Progresso do perfil: {profile.completion_score.overall * 100:.0f}%")
        print(f"[{'#' * int(profile.completion_score.overall * 20)}{' ' * (20 - int(profile.completion_score.overall * 20))}]")
        
        # Exibir informações de debug (opcional, remover em produção)
        if extraction_output.extraction_feedback:
            print(f"\n[DEBUG] Feedback do extrator: {extraction_output.extraction_feedback}\n")
        
        # Verificar se o perfil está suficientemente completo
        if profile.completion_score.overall >= 0.8:
            session.is_complete = True
    
    # Finalizar sessão
    if session.is_complete:
        # Recomendar documentos
        documents = recommend_documents(profile)
        
        # Mensagem de encerramento
        closing_message = (
            f"Obrigado, {profile.personal_info.name}! Completamos o perfil inicial para sua holding patrimonial. "
            f"Na próxima etapa, você terá uma reunião com nossos consultores especializados. "
            f"Para essa reunião, recomendamos que você tenha em mãos os seguintes documentos:\n"
        )
        
        for doc in documents:
            closing_message += f"- {doc.name}: {doc.reason}\n"
        
        closing_message += (
            "\nNosso time entrará em contato para agendar sua reunião. "
            "Obrigado por confiar em nossos serviços!"
        )
        
        print(f"\nAssistente: {closing_message}\n")
        
        # Adicionar mensagem ao histórico
        conversation_history.append(
            ConversationMessage(
                session_id=session_id,
                role="assistant",
                content=closing_message
            )
        )

if __name__ == "__main__":
    asyncio.run(run_chat_session())
