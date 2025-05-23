from pydantic_ai import Agent, RunContext
from typing import Optional, List, Dict, Any, Set
from pydantic import BaseModel, Field
from models.pydantic_models import ClientProfile, ConversationMessage, PersonalInfo, FamilyMember, Asset, Goal, Concern, MaritalStatus
from dotenv import load_dotenv

load_dotenv()
class ConversationDependencies:
    profile: ClientProfile
    conversation_history: List[ConversationMessage]
    missing_fields: Dict[str, List[str]] = {}
    extraction_confidence: float = 0.0
    last_extraction_updates: Dict[str, Any] = {}

class NextQuestionOutput(BaseModel):
    question: str
    context: Optional[str] = None
    section_focus: str  # personal, family, assets, goals, concerns
    targeted_fields: List[str] = []
    follow_up: bool = False

conversation_agent = Agent(
    'openai:gpt-4o',
    deps_type=ConversationDependencies,
    output_type=NextQuestionOutput,
    system_prompt=(
        'Você é um consultor especializado em estruturação patrimonial, '
        'conversando com um cliente de perfil sênior (50-85 anos). '
        'Mantenha um tom respeitoso, formal e claro. '
        'Faça apenas uma pergunta por vez e contextualize com informações já obtidas. '
        'Adapte a linguagem para ser acessível a pessoas com menor familiaridade tecnológica. '
        'Suas perguntas devem ser naturais e fluidas, evitando um tom mecânico ou repetitivo. '
        'Personalize a conversa com base no que já sabe sobre o cliente. '
        '\n\n'
        'IMPORTANTE: Você deve focar em obter informações específicas que estão faltando no perfil. '
        'Quando receber uma lista de campos ausentes, formule perguntas diretas para obter essas informações. '
        'Se a última resposta do cliente não forneceu as informações esperadas, faça um follow-up mais específico. '
        'Evite perguntas genéricas quando houver campos específicos a serem preenchidos. '
        '\n\n'
        'Você deve gerar a próxima pergunta considerando:'
        '\n1. Os campos específicos que estão faltando no perfil'
        '\n2. O histórico da conversa e o fluxo natural do diálogo'
        '\n3. A confiança da última extração de informações'
        '\n4. O tom adequado para um público sênior com possível menor familiaridade tecnológica'
        '\n\n'
        'Seja conversacional e natural, mas também objetivo e direcionado para obter as informações necessárias.'
        'Instrucoes adicionais: SEMPRE comece a resposta reconhecendo a ultima resposta do cliente. Não seja robotico e nao comece diretamente sua mensagem com a pergunta'
    ),
)

@conversation_agent.system_prompt
async def add_profile_context(ctx: RunContext[ConversationDependencies]) -> str:
    """Adiciona o contexto do perfil atual e campos ausentes ao prompt do sistema."""
    profile = ctx.deps.profile
    conversation_history = ctx.deps.conversation_history
    missing_fields = ctx.deps.missing_fields
    extraction_confidence = ctx.deps.extraction_confidence
    last_extraction_updates = ctx.deps.last_extraction_updates
    
    context = "Informações já coletadas sobre o cliente:\n"
    
    if profile.personal_info.name:
        context += f"- Nome: {profile.personal_info.name}\n"
    if profile.personal_info.age:
        context += f"- Idade: {profile.personal_info.age} anos\n"
    if profile.personal_info.marital_status:
        context += f"- Estado civil: {profile.personal_info.marital_status.value}\n"
    if profile.personal_info.profession:
        context += f"- Profissão: {profile.personal_info.profession}\n"
    
    # Adicionar informações sobre família
    if profile.family_members:
        context += "\nFamiliares:\n"
        for member in profile.family_members:
            context += f"- {member.relation}"
            if member.name:
                context += f": {member.name}"
            if member.age:
                context += f", {member.age} anos"
            context += "\n"
    
    # Adicionar informações sobre patrimônios
    if profile.assets:
        context += "\nPatrimônios:\n"
        for asset in profile.assets:
            context += f"- {asset.asset_type.value}: {asset.description}"
            if asset.estimated_value:
                context += f", valor estimado: R$ {asset.estimated_value:,.2f}"
            context += "\n"
    
    # Adicionar informações sobre objetivos
    if profile.goals:
        context += "\nObjetivos:\n"
        for goal in profile.goals:
            context += f"- {goal.goal_type.value}: {goal.description}\n"
    
    # Adicionar informações sobre preocupações
    if profile.concerns:
        context += "\nPreocupações:\n"
        for concern in profile.concerns:
            context += f"- {concern.description}\n"
    
    # Adicionar informações sobre completude
    context += f"\nProgresso de preenchimento do perfil:\n"
    context += f"- Informações pessoais: {profile.completion_score.personal * 100:.0f}%\n"
    context += f"- Informações familiares: {profile.completion_score.family * 100:.0f}%\n"
    context += f"- Patrimônios: {profile.completion_score.assets * 100:.0f}%\n"
    context += f"- Objetivos: {profile.completion_score.goals * 100:.0f}%\n"
    context += f"- Progresso geral: {profile.completion_score.overall * 100:.0f}%\n"
    
    # Adicionar histórico recente da conversa (últimas 3 interações)
    if len(conversation_history) > 0:
        context += "\nHistórico recente da conversa:\n"
        start_idx = max(0, len(conversation_history) - 6)  # Últimas 3 pares de interações (usuário + assistente)
        for i, msg in enumerate(conversation_history[start_idx:]):
            prefix = "Usuário: " if msg.role == "user" else "Assistente: "
            context += f"{prefix}{msg.content}\n"
    
    # Adicionar informações sobre campos ausentes
    context += "\nCampos específicos que precisam ser preenchidos:\n"
    
    if missing_fields:
        for section, fields in missing_fields.items():
            if fields:
                context += f"- Seção {section}: {', '.join(fields)}\n"
    else:
        # Identificar campos ausentes se não foram explicitamente fornecidos
        if not profile.personal_info.name:
            context += "- Nome do cliente\n"
        if not profile.personal_info.age:
            context += "- Idade do cliente\n"
        if not profile.personal_info.marital_status:
            context += "- Estado civil do cliente\n"
        if not profile.personal_info.profession:
            context += "- Profissão/ocupação do cliente\n"
        
        if profile.completion_score.family < 0.3:
            context += "- Informações sobre o núcleo familiar (cônjuge, filhos, dependentes)\n"
        
        if profile.completion_score.assets < 0.4:
            context += "- Informações sobre patrimônio (imóveis, empresas, investimentos)\n"
        
        if profile.completion_score.goals < 0.6:
            context += "- Objetivos com a estruturação patrimonial\n"
        
        if profile.completion_score.overall >= 0.6 and len(profile.concerns) == 0:
            context += "- Preocupações específicas sobre estruturação patrimonial\n"
    
    # Adicionar feedback sobre a última extração
    context += f"\nConfiança da última extração: {extraction_confidence * 100:.0f}%\n"
    
    if last_extraction_updates:
        context += "Informações extraídas na última interação:\n"
        for section, updates in last_extraction_updates.items():
            if updates:
                context += f"- {section}: {updates}\n"
    
    # Orientações para a próxima pergunta
    context += "\nOrientações para a próxima pergunta:\n"
    
    # Determinar se deve fazer follow-up
    if extraction_confidence < 0.5 and conversation_history:
        context += "- A última resposta teve baixa confiança de extração. Faça um follow-up mais específico.\n"
    
    # Priorizar campos ausentes mais importantes
    priority_fields = []
    
    if not profile.personal_info.name:
        priority_fields.append("nome do cliente")
    elif not profile.personal_info.age:
        priority_fields.append("idade do cliente")
    elif not profile.personal_info.marital_status:
        priority_fields.append("estado civil do cliente")
    elif not profile.personal_info.profession:
        priority_fields.append("profissão do cliente")
    elif profile.personal_info.marital_status in [MaritalStatus.MARRIED, MaritalStatus.STABLE_UNION] and len(profile.family_members) == 0:
        priority_fields.append("informações sobre cônjuge/companheiro(a)")
    elif profile.completion_score.assets < 0.2:
        priority_fields.append("principais bens e investimentos")
    elif profile.completion_score.goals < 0.3:
        priority_fields.append("objetivos principais com a estruturação patrimonial")
    
    if priority_fields:
        context += f"- Prioridade máxima: obter {', '.join(priority_fields)}\n"
    
    context += "- Mantenha um tom conversacional e natural\n"
    context += "- Seja específico nas perguntas para obter as informações que faltam\n"
    
    return context
