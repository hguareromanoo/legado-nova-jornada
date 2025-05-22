from pydantic_ai import Agent, RunContext
from models.pydantic_models import (
    PersonalInfo, FamilyMember, Asset, Goal, Concern,
    MaritalStatus, AssetType, GoalType, ClientProfile
)
from typing import Optional, List, Dict, Any, Set
from pydantic import BaseModel, Field

class ExtractionOutput(BaseModel):
    personal_info_updates: Optional[PersonalInfo] = None
    family_members_updates: Optional[List[FamilyMember]] = None
    assets_updates: Optional[List[Asset]] = None
    goals_updates: Optional[List[Goal]] = None
    concerns_updates: Optional[List[Concern]] = None
    confidence_score: float = Field(ge=0.0, le=1.0)
    missing_fields: Dict[str, List[str]] = {}
    extraction_feedback: Optional[str] = None
    is_complete: bool = Field(default=False, description="O perfil do usuário está completo ou precisa ainda de algum detalhe?")

class ExtractionDependencies:
    current_profile: Optional[ClientProfile] = None
    section_focus: Optional[str] = None
    targeted_fields: Optional[List[str]] = None

extraction_agent = Agent(
    'openai:gpt-4o',
    deps_type=ExtractionDependencies,
    output_type=ExtractionOutput,
    system_prompt=(
        'Você é um especialista em extrair informações estruturadas de texto. '
        'Analise a resposta do usuário e extraia entidades relevantes para o perfil patrimonial. '
        'Retorne apenas as entidades identificadas com alta confiança. '
        'Para campos incertos, deixe como None. '
        'Forneça uma pontuação de confiança para a extração realizada.'
        '\n\n'
        'Você deve extrair:'
        '\n- Informações pessoais (nome, idade, estado civil, profissão)'
        '\n- Membros da família (relação, nome, idade, se é dependente)'
        '\n- Patrimônios (tipo, descrição, valor estimado, localização, propriedade)'
        '\n- Objetivos com a holding (tipo, descrição, prioridade)'
        '\n- Preocupações (descrição, prioridade)'
        '\n\n'
        'Tipos de estado civil: solteiro, casado, divorciado, viúvo, união estável, outro'
        '\nTipos de patrimônio: imóvel, empresa, investimento financeiro, propriedade rural, outro'
        '\nTipos de objetivos: sucessão familiar, otimização fiscal, proteção patrimonial, governança familiar, outro'
        '\n\n'
        'IMPORTANTE: Além de extrair informações, você deve identificar quais campos ainda estão faltando'
        'no perfil do cliente e fornecer feedback sobre o que precisa ser perguntado a seguir.'
        'Além disso, se a completetion_score estiver alta(>0.85), sugira uma pergunta de desfecho, para então dar como is_complete = True.'
    ),
)

@extraction_agent.system_prompt
async def add_extraction_context(ctx: RunContext[ExtractionDependencies]) -> str:
    """Adiciona o contexto do perfil atual e campos alvo ao prompt do sistema."""
    context = ""
    
    if ctx.deps.current_profile:
        profile = ctx.deps.current_profile
        context += "Perfil atual do cliente:\n"
        
        # Informações pessoais
        context += "Informações pessoais:\n"
        if profile.personal_info.name:
            context += f"- Nome: {profile.personal_info.name}\n"
        else:
            context += "- Nome: [não informado]\n"
            
        if profile.personal_info.age:
            context += f"- Idade: {profile.personal_info.age} anos\n"
        else:
            context += "- Idade: [não informada]\n"
            
        if profile.personal_info.marital_status:
            context += f"- Estado civil: {profile.personal_info.marital_status.value}\n"
        else:
            context += "- Estado civil: [não informado]\n"
            
        if profile.personal_info.profession:
            context += f"- Profissão: {profile.personal_info.profession}\n"
        else:
            context += "- Profissão: [não informada]\n"
        
        # Familiares
        context += "\nFamiliares:\n"
        if profile.family_members:
            for member in profile.family_members:
                context += f"- {member.relation}"
                if member.name:
                    context += f": {member.name}"
                if member.age:
                    context += f", {member.age} anos"
                context += "\n"
        else:
            context += "- [nenhum familiar informado]\n"
        
        # Patrimônios
        context += "\nPatrimônios:\n"
        if profile.assets:
            for asset in profile.assets:
                context += f"- {asset.asset_type.value}: {asset.description}"
                if asset.estimated_value:
                    context += f", valor estimado: R$ {asset.estimated_value:,.2f}"
                context += "\n"
        else:
            context += "- [nenhum patrimônio informado]\n"
        
        # Objetivos
        context += "\nObjetivos:\n"
        if profile.goals:
            for goal in profile.goals:
                context += f"- {goal.goal_type.value}: {goal.description}\n"
        else:
            context += "- [nenhum objetivo informado]\n"
        
        # Preocupações
        context += "\nPreocupações:\n"
        if profile.concerns:
            for concern in profile.concerns:
                context += f"- {concern.description}\n"
        else:
            context += "- [nenhuma preocupação informada]\n"
    
    # Adicionar informações sobre o foco atual e campos alvo
    if ctx.deps.section_focus:
        context += f"\nFoco atual da conversa: {ctx.deps.section_focus}\n"
    
    if ctx.deps.targeted_fields:
        context += f"Campos específicos sendo buscados: {', '.join(ctx.deps.targeted_fields)}\n"
    
    context += "\nApós extrair as informações, identifique quais campos ainda estão faltando e forneça feedback sobre o que precisa ser perguntado a seguir.\n"
    
    return context

@extraction_agent.tool(retries=3)
async def identify_missing_fields(ctx: RunContext[ExtractionDependencies]) -> Dict[str, List[str]]:
    from pydantic_ai import ModelRetry
    
    """Identifica campos que ainda estão faltando no perfil."""
    missing_fields = {
        "personal": [],
        "family": [],
        "assets": [],
        "goals": [],
        "concerns": []
    }
    
    if not ctx.deps.current_profile:
        # Se não há perfil, todos os campos estão faltando
        missing_fields["personal"] = ["nome", "idade", "estado civil", "profissão"]
        missing_fields["family"] = ["informações sobre cônjuge/companheiro(a)", "informações sobre filhos"]
        missing_fields["assets"] = ["principais bens", "investimentos", "empresas"]
        missing_fields["goals"] = ["objetivos com a estruturação patrimonial"]
        missing_fields["concerns"] = ["preocupações específicas"]
        return missing_fields
    
    profile = ctx.deps.current_profile
    
    # Verificar informações pessoais
    if not profile.personal_info.name:
        missing_fields["personal"].append("nome")
    if not profile.personal_info.age:
        missing_fields["personal"].append("idade")
    if not profile.personal_info.marital_status:
        missing_fields["personal"].append("estado civil")
    if not profile.personal_info.profession:
        missing_fields["personal"].append("profissão")
    
    # Verificar informações familiares
    if profile.personal_info.marital_status in [MaritalStatus.MARRIED, MaritalStatus.STABLE_UNION]:
        has_spouse = any(member.relation.lower() in ["cônjuge", "esposa", "esposo", "companheiro", "companheira"] 
                        for member in profile.family_members)
        if not has_spouse:
            missing_fields["family"].append("informações sobre cônjuge/companheiro(a)")
    
    if len(profile.family_members) == 0:
        missing_fields["family"].append("composição familiar")
    elif not any(member.relation.lower() in ["filho", "filha", "enteado", "enteada"] for member in profile.family_members):
        missing_fields["family"].append("informações sobre filhos/dependentes")
    
    # Verificar patrimônios
    if len(profile.assets) == 0:
        missing_fields["assets"].append("principais bens e investimentos")
    else:
        has_real_estate = any(asset.asset_type == AssetType.REAL_ESTATE for asset in profile.assets)
        has_company = any(asset.asset_type == AssetType.COMPANY for asset in profile.assets)
        has_financial = any(asset.asset_type == AssetType.FINANCIAL for asset in profile.assets)
        
        if not has_real_estate:
            missing_fields["assets"].append("imóveis")
        if not has_company:
            missing_fields["assets"].append("empresas/participações societárias")
        if not has_financial:
            missing_fields["assets"].append("investimentos financeiros")
    
    # Verificar objetivos
    if len(profile.goals) == 0:
        missing_fields["goals"].append("objetivos com a estruturação patrimonial")
    else:
        has_succession = any(goal.goal_type == GoalType.SUCCESSION for goal in profile.goals)
        has_tax = any(goal.goal_type == GoalType.TAX for goal in profile.goals)
        has_protection = any(goal.goal_type == GoalType.PROTECTION for goal in profile.goals)
        
        if not has_succession:
            missing_fields["goals"].append("objetivos sucessórios")
        if not has_tax:
            missing_fields["goals"].append("objetivos fiscais")
        if not has_protection:
            missing_fields["goals"].append("proteção patrimonial")
    
    # Verificar preocupações
    if len(profile.concerns) == 0:
        missing_fields["concerns"].append("preocupações específicas")
    
    return missing_fields
        

@extraction_agent.tool(retries=3)
async def generate_extraction_feedback(ctx: RunContext[ExtractionDependencies], 
                                      extracted_info: Dict[str, Any],
                                      missing_fields: Dict[str, List[str]]) -> str:
    """Gera feedback sobre a extração e sugere próximos passos."""
    feedback = "Análise da extração:\n"

    # Verificar o que foi extraído
    has_extractions = False
    
    if extracted_info.get("personal_info_updates"):
        has_extractions = True
        feedback += "- Extraí informações pessoais: "
        feedback += ", ".join(f"{k}={v}" for k, v in extracted_info["personal_info_updates"].model_dump().items() if v is not None)
        feedback += "\n"
    
    if extracted_info.get("family_members_updates"):
        has_extractions = True
        if isinstance(extracted_info["family_members_updates"], (list, tuple, dict, set)):
            feedback += f"- Extraí informações sobre {len(extracted_info['family_members_updates'])} familiar(es)\n"
        else:
            feedback += f"- Extraí informações sobre familiares\n"
    
    if extracted_info.get("assets_updates"):
        has_extractions = True
        if isinstance(extracted_info["assets_updates"], (list, tuple, dict, set)):
            feedback += f"- Extraí informações sobre {len(extracted_info['assets_updates'])} bem(ns)/investimento(s)\n"
        else:
            feedback += f"- Extraí informações sobre bens/investimentos\n"
    
    if extracted_info.get("goals_updates"):
        has_extractions = True
        if isinstance(extracted_info["goals_updates"], (list, tuple, dict, set)):
            feedback += f"- Extraí informações sobre {len(extracted_info['goals_updates'])} objetivo(s)\n"
        else:
            feedback += f"- Extraí informações sobre objetivos\n"
    
    if extracted_info.get("concerns_updates"):
        has_extractions = True
        if isinstance(extracted_info["concerns_updates"], (list, tuple, dict, set)):
            feedback += f"- Extraí informações sobre {len(extracted_info['concerns_updates'])} preocupação(ões)\n"
        else:
            feedback += f"- Extraí informações sobre preocupações\n"
    
    if not has_extractions:
        feedback += "- Não consegui extrair novas informações desta resposta\n"
    
    # Sugerir próximos passos com base nos campos ausentes
    feedback += "\nSugestão para próxima pergunta:\n"
    
    # Priorizar campos ausentes
    priority_section = None
    priority_fields = []
    
    # Verificar campos pessoais primeiro
    if missing_fields.get("personal"):
        priority_section = "personal"
        priority_fields = missing_fields["personal"]
    # Depois família (se informações pessoais estiverem completas)
    elif not missing_fields.get("personal") and missing_fields.get("family"):
        priority_section = "family"
        priority_fields = missing_fields["family"]
    # Depois patrimônio
    elif not missing_fields.get("personal") and not missing_fields.get("family") and missing_fields.get("assets"):
        priority_section = "assets"
        priority_fields = missing_fields["assets"]
    # Depois objetivos
    elif not missing_fields.get("personal") and not missing_fields.get("family") and not missing_fields.get("assets") and missing_fields.get("goals"):
        priority_section = "goals"
        priority_fields = missing_fields["goals"]
    # Por fim, preocupações
    elif not missing_fields.get("personal") and not missing_fields.get("family") and not missing_fields.get("assets") and not missing_fields.get("goals") and missing_fields.get("concerns"):
        priority_section = "concerns"
        priority_fields = missing_fields["concerns"]
    
    if priority_section and priority_fields:
        feedback += f"- Foco recomendado: {priority_section} - {', '.join(priority_fields)}\n"
        
        if priority_section == "personal":
            if "nome" in priority_fields:
                feedback += "  Pergunte o nome completo do cliente\n"
            elif "idade" in priority_fields:
                feedback += "  Pergunte a idade do cliente\n"
            elif "estado civil" in priority_fields:
                feedback += "  Pergunte o estado civil do cliente\n"
            elif "profissão" in priority_fields:
                feedback += "  Pergunte sobre a profissão/ocupação atual do cliente\n"
        
        elif priority_section == "family":
            if "informações sobre cônjuge/companheiro(a)" in priority_fields:
                feedback += "  Pergunte detalhes sobre o cônjuge/companheiro(a) (nome, idade)\n"
            elif "composição familiar" in priority_fields or "informações sobre filhos/dependentes" in priority_fields:
                feedback += "  Pergunte sobre filhos, dependentes e outros familiares relevantes\n"
        
        elif priority_section == "assets":
            if "principais bens e investimentos" in priority_fields:
                feedback += "  Pergunte sobre os principais bens e investimentos do cliente\n"
            elif "imóveis" in priority_fields:
                feedback += "  Pergunte especificamente sobre imóveis (residenciais, comerciais)\n"
            elif "empresas/participações societárias" in priority_fields:
                feedback += "  Pergunte sobre empresas ou participações societárias\n"
            elif "investimentos financeiros" in priority_fields:
                feedback += "  Pergunte sobre investimentos financeiros\n"
        
        elif priority_section == "goals":
            if "objetivos com a estruturação patrimonial" in priority_fields:
                feedback += "  Pergunte sobre os principais objetivos com a estruturação patrimonial\n"
            elif "objetivos sucessórios" in priority_fields:
                feedback += "  Pergunte sobre objetivos relacionados à sucessão familiar\n"
            elif "objetivos fiscais" in priority_fields:
                feedback += "  Pergunte sobre objetivos de otimização fiscal\n"
            elif "proteção patrimonial" in priority_fields:
                feedback += "  Pergunte sobre objetivos de proteção patrimonial\n"
                
        elif priority_section == "concerns":
            feedback += "  Pergunte sobre preocupações específicas relacionadas ao patrimônio\n"
    else:
        feedback += "- O perfil parece estar completo. Sugiro aprofundar em alguma área específica de interesse do cliente.\n"
    
    return feedback