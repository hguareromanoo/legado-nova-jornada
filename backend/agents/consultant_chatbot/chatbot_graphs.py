from typing import Literal, Annotated, List, Optional, Dict, Any
from langgraph.graph.message import add_messages
from langgraph.graph import StateGraph, END, START
from langgraph.checkpoint.memory import MemorySaver
from langchain.chat_models import init_chat_model
from langchain.schema import AIMessage
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from typing_extensions import TypedDict
from enum import Enum
from agents.consultant_chatbot.sections_semantic_search import search_sections
from database.manager import SupabaseManager
from services.profile_service import ProfileService

llm = init_chat_model(
    "gpt-4o",
    model_provider="openai"
)


# Load Supabase db
async def initialize_db():
    db = SupabaseManager()
    await db.initialize()

    return db



# ========================================================================
#                           Class Structure
# ========================================================================

# ------------ Enums ------------

class QueryTypeEnum(str, Enum):
    FACTUAL = "pergunta factual"
    ANALYTICAL = "pergunta jurídico-analítica"
    OPERATIONAL = "pergunta operacional"
    TECHNICAL = "pergunta técnico-consultiva"
    OTHER = "outra"


# ------------ Question Classifier ------------

class ClassifierModel(BaseModel):
    query_type: List[QueryTypeEnum] = Field(
        description=(
            "Classificação da pergunta. Pode conter uma ou mais das seguintes categorias:\n\n"
            "- **Pergunta factual**: busca por dados específicos que precisam ser consultados no banco de dados do cliente, como CNPJ, razão social, nome dos sócios, inscrição estadual, registro na Junta Comercial, entre outros.\n"
            "- **Pergunta jurídico-analítica**: validação ou análise de cláusulas, documentos e requisitos legais.\n"
            "- **Pergunta operacional**: solicitação de instruções, etapas ou procedimentos, tanto para execução interna na consultoria quanto para apresentação organizada na trilha de acompanhamento do cliente.\n"
            "- **Pergunta técnico-consultiva**: busca por conhecimento técnico, legislativo ou normativo externo ao contexto dos documentos do cliente.\n"
            "- **Outra**: perguntas que não se encaixam nas categorias anteriores, demandando respostas genéricas ou interpretativas."
    ))


# ------------ Analytical Question ------------

class ExtractedAnalytical(BaseModel):
    section_title: Optional[List[str]] = Field(description="Títulos de seções e subseções.")
    document_type: Optional[List[str]] = Field(description="Tipo do documento referenciado.")


class AnalyticalQModel(BaseModel):
    sentence: List[str] = Field(description="Sentenças em que foram identificadas referências à seções ou documentos.")
    section: ExtractedAnalytical = Field(
        description=(
            "Classe instanciada com títulos de seções, subseções ou nomes de documentos jurídicos.\n"
            "Relaciona-se a perguntas jurídico-analíticas, focadas na validação ou interpretação de cláusulas, termos e seções de documentos do cliente."
        )
    )


# ------------ Tecnical Question ------------

class RagQModel(BaseModel):
    info: List[str] = Field(
        description=(
            "Lista de tópicos, conceitos ou informações técnicas externas.\n"
            "Refere-se às perguntas técnico-consultivas, que exigem conhecimento fora do contexto dos documentos — como leis, normas, processos jurídicos ou informações do setor."
        )
    )


# ------------ Formatter ------------

class FormatterModel(BaseModel):
    prompt: str = Field(
        description=()
    )


# ------------ Chatbot ------------

class ChatbotModel(BaseModel):
    response: str = Field(
        description=(
            "Resposta final, objetiva e profissional, gerada pelo assistente.\n"
            "Deve ser clara, precisa e adequada ao contexto da consultoria, considerando tanto os dados fornecidos quanto as classificações anteriores.\n"
            "A linguagem deve ser formal, orientada à tomada de decisão, e alinhada ao padrão de comunicação de consultores especializados."
        )
    )


# ------------ Extracted Data ------------

class ExtractedData(TypedDict, total=False):
    RAW_DATA: List[Dict] # All client extracted data
    SECTIONS: AnalyticalQModel # Sections and documents referenced in the question
    OPERATIONAL: Any # Complete client profile
    TECHNICAL: RagQModel


# ------------ Chat Log ------------

class State(TypedDict):
    messages: Annotated[list, add_messages]
    query_type: Optional[List[str]]
    next_steps: Optional[List[str]]
    step_index: Optional[int]
    extracted_data: Optional[Dict[str, ExtractedData]]
    sections: Optional[List[str]] # Extracted sections
    query: str
    client_id: str | int
    database: SupabaseManager
    prompt: Optional[str]
    formatted_data: Optional[str]
    formatted_info: Optional[str]
    log: Optional[List[tuple]]




#========================================================================
#                               Nodes
#========================================================================

# ------------ Classifier Agent ------------

def classifier_agent(state: State):
    classifier_llm = llm.with_structured_output(ClassifierModel)

    classes = classifier_llm.invoke([
        {"role": "system", "content": """
            Você é um assistente responsável por classificar perguntas feitas por consultores.

            Sua tarefa é identificar corretamente uma ou mais categorias correspondentes à pergunta recebida, conforme os tipos definidos na especificação do output. 

            - Se a pergunta se enquadrar em mais de uma categoria, inclua todas.  
            - Se não tiver certeza entre duas categorias, selecione ambas.  
            - Sempre retorne uma lista, mesmo que contenha apenas uma opção.

            Retorne exclusivamente a classificação, sem explicações adicionais.
        """},
        {"role": "user", "content": state['query']}
    ])

    state['query_type'] = classes
    return state


# ------------ Analytical Agent ------------

def analytical_extractor_agent(state: State):
    extractor_llm = llm.with_structured_output(AnalyticalQModel)

    response = extractor_llm.invoke([
        {"role": "system", "content": """
            Você é um assistente especializado em identificar seções, subseções, cláusulas ou documentos jurídicos mencionados na pergunta feita pelo consultor.

            Sua função é listar quaisquer referências a:
            - Nomes de seções, cláusulas ou itens de documentos
            - Títulos de documentos, contratos ou relatórios

            Exemplos:
            - "Cláusula de sucessão"
            - "Seção de distribuição de cotas"
            - "Contrato de constituição"

            Inclua as sentenças onde essas referências aparecem.
            Se não houver referências desse tipo, retorne listas vazias.
        """},
        {"role": "user", "content": state['query']}
    ])

    state.setdefault('extracted_data', {})['SECTIONS'] = response
    return state


# ------------ Technical Agent ------------

def technical_extractor_agent(state: State):
    extractor_llm = llm.with_structured_output(RagQModel)

    response = extractor_llm.invoke([
        {"role": "system", "content": """
            Você é um assistente especializado em identificar demandas por conhecimento técnico externo na pergunta feita pelo consultor.

            Sua função é reconhecer quando a pergunta requer informações como:
            - Legislações, normas, regulamentações
            - Conceitos técnicos do direito, finanças ou gestão patrimonial
            - Procedimentos jurídicos, fiscais ou societários que não estejam diretamente em documentos internos

            Exemplos:
            - "Quais são os requisitos legais para abertura de uma EIRELI?"
            - "Quais impostos incidem na doação de cotas?"

            Liste os tópicos, conceitos ou referências técnicas citadas ou implicitamente solicitadas.
            Se não houver, retorne uma lista vazia.
        """},
        {"role": "user", "content": state['query']}
    ])

    state.setdefault('extracted_data', {})['TECHNICAL'] = response
    return state


# ------------ Response Agent ------------

def response_agent(state: State):
    extractor_llm = llm.with_structured_output(ChatbotModel)

    reply = extractor_llm.invoke([
        {"role": "system", "content": """
        Você é um assistente especializado em consultoria para holdings patrimoniais e familiares.

        Sua função é responder de maneira clara, objetiva, profissional e tecnicamente precisa às perguntas feitas por consultores.

        Utilize sempre que possível os dados fornecidos, sejam eles informações do perfil do cliente, dados brutos extraídos de documentos ou trechos relevantes de documentos.

        Se os dados forem insuficientes para uma resposta conclusiva, aponte quais informações adicionais o consultor deve sugerir para o cliente buscar para prosseguir corretamente.

        Mantenha uma linguagem formal, mas acessível e assertiva. Evite suposições não fundamentadas.
        """},
        {"role": "user", "content": f"""
        Pergunta realizada pelo consultor:
        {state['query']}


        Dados operacionais do cliente (se disponíveis):
        {state.get('formatted_info', 'Não foram encontradas informações operacionais do cliente.')}


        Dados brutos extraídos de documentos (se disponíveis):
        {state.get('formatted_data', 'Não foram encontrados dados brutos relevantes.')}


        Seções e documentos relevantes (se disponíveis):
        {'\n'.join(state.get('sections', ['Não foram encontradas seções relevantes.']))}

        Últimas mensagens do chat para contexto:
        {"\n\n".join(["\n".join(pair) for pair in state['log']])}


        Com base nessas informações, elabore uma resposta precisa, clara e profissional.
        Sempre que possível, cite a legislação aplicável para fundamentar a resposta.
        """}
    ])

    state["messages"] = state.get("messages", []) + [{"role": "assistant", "content": reply.response}]
    return state


# ------------ Formatter Functions ------------

def format_data(state: State):
    output = []

    for doc in state["extracted_data"]["RAW_DATA"]:
        document_key = doc.get("document_key", "UNKNOWN_DOCUMENT")
        output.append(f"{document_key.upper()}")

        entries = doc.get("data", [])
        if entries:
            for item in entries:
                key = item.get("key", "").strip().captalize()
                value = item.get("value", "").strip()
                output.append(f"{key} - {value}")
        else:
            output.append("(Sem dados)")

        output.append("")  # Linha em branco entre os documentos

    state["formatted_data"] = "\n".join(output)
    return state


def format_operational_data(state: State) -> str:
    """
    Formata o ClientProfile no formato texto estruturado.

    Args:
        profile (ClientProfile): Objeto com os dados operacionais.

    Returns:
        str: Texto formatado.
    """
    output = []
    profile = state["extracted_data"]["OPERATIONAL"]
    # Header
    output.append(f"PROFILE_ID: {profile.profile_id}")
    output.append(f"Created at: {profile.created_at}")
    output.append(f"Updated at: {profile.updated_at}")
    output.append("")

    # Personal Info
    output.append("## Personal Info")
    for key, value in profile.personal_info.items():
        output.append(f"{key} - {value}")
    output.append("")

    # Family Members
    output.append("## Family Members")
    if profile.family_members:
        for member in profile.family_members:
            name = member.get("name", "Unknown")
            relation = member.get("relation", "Unknown")
            age = member.get("age", "N/A")
            output.append(f"{name} - {relation} - {age}")
    else:
        output.append("No family members registered.")
    output.append("")

    # Assets
    output.append("## Assets")
    if profile.assets:
        for asset in profile.assets:
            asset_type = asset.get("type", "Unknown")
            description = asset.get("description", "Unknown")
            value = asset.get("value", "N/A")
            output.append(f"{asset_type} - {description} - {value}")
    else:
        output.append("No assets registered.")
    output.append("")

    # Goals
    output.append("## Goals")
    if profile.goals:
        for goal in profile.goals:
            output.append(f"- {goal}")
    else:
        output.append("No goals registered.")
    output.append("")

    # Concerns
    output.append("## Concerns")
    if profile.concerns:
        for concern in profile.concerns:
            output.append(f"- {concern}")
    else:
        output.append("No concerns registered.")
    output.append("")

    # Document Recommendations
    output.append("## Document Recommendations")
    if profile.document_recommendations:
        for doc in profile.document_recommendations:
            name = doc.get("document_name", "Unknown")
            key = doc.get("document_key", "Unknown")
            output.append(f"{name} - {key}")
    else:
        output.append("No document recommendations.")
    output.append("")

    # Notes
    output.append("## Notes")
    output.append(profile.notes if profile.notes else "No notes.")
    output.append("")

    # Completion Score
    output.append("## Completion Score")
    output.append(str(profile.completion_score if profile.completion_score is not None else "N/A"))

    state["formatted_info"] = "\n".join(output)
    return state


# ------------ Process functions ------------

async def get_data(state: State):
    db = state["database"]
    data = await db.execute_rpc(
        function_name="get_document_data_grouped_by_document_key",
        params={"p_profile_id": state["client_id"]}
    )

    state["extracted_data"]["FACTUAL"] = data
    return state


def get_section(state: State):
    sections = search_sections(client_id=state["client_id"], extracted_data=state["extracted_data"]["SECTIONS"])
    state["sections"] = sections

    return state


async def get_ops(state: State):
    user_profile = await ProfileService(state["database"]).get_complete_profile(state["client_id"])
    state["extracted_data"]["OPERATIONAL"] = user_profile

    return state


def get_technical(state: State):
    # Placeholder function for technical demands
    pass


# ------------ Router ------------

def router(state: State):
    """Multi-branch router"""
    query_type = state.get("query_type", [])
    
    next_steps = []

    if QueryTypeEnum.FACTUAL in query_type:
        next_steps.append("factual")
    if QueryTypeEnum.OPERATIONAL in query_type:
        next_steps.append("operational")
    # if QueryTypeEnum.TECHNICAL in query_type:
    #     next_steps.append("technical")
    if QueryTypeEnum.ANALYTICAL in query_type:
        next_steps.append("analytical")

    if not next_steps:
        next_steps.append("chatbot")  # fallback genérico
    
    state["next_steps"] = next_steps
    state["step_index"] = 0  # Controle de índice dos steps
    return state


# ------------ Persist Chat Log ------------

async def save_chat_log(state: State):
    """Persist user entry and chat response in database."""
    db = state["database"]
    query = state["query"]
    assistant_msgs = [m for m in state["messages"] if isinstance(m, AIMessage)]
    user_id = state["client_id"]
    await db.insert(table="chat_log", data={
        "content": query,
        "role": "user",
        "client_id": user_id
    })
    await db.insert(table="chat_log", data={
        "content": assistant_msgs[-1].content,
        "role": "assistant",
        "client_id": user_id
    })


async def get_chat_log(state: State):
        """Get last ten messages in chat filtered by client_id"""
        db = state["database"]
        log = await db.select(table="chat_log", filters={"profile_id": state["client_id"]}, order="created_at")
        return [(msg["content"], msg["role"]) for msg in reversed(log)[:10]]




#========================================================================
#                               Graphs
#========================================================================

# ------------ Controller ------------

def next_step(state: State):
    """Step controller"""
    steps = state.get("next_steps", [])
    index = state.get("step_index", 0)

    if index < len(steps):
        current = steps[index]
        state["step_index"] += 1
        return current
    
    return "chatbot"
    

# ------------ Graphs ------------

graph_builder = StateGraph(State)

graph_builder.add_node("classifier", classifier_agent)
graph_builder.add_node("router", router)
graph_builder.add_node("get_data", get_data)
graph_builder.add_node("get_ops", get_ops)
graph_builder.add_node("technical", technical_extractor_agent)
graph_builder.add_node("get_technical", get_technical)
graph_builder.add_node("analytical", analytical_extractor_agent)
graph_builder.add_node("get_section", get_section)
graph_builder.add_node("chatbot", response_agent)
graph_builder.add_node("data_formatter", format_data)
graph_builder.add_node("operational_data_formatter", format_operational_data)

graph_builder.add_edge(START, "classifier")
graph_builder.add_edge("classifier", "router")

graph_builder.add_conditional_edges(
    "router",
    next_step,
    {
        "factual": "get_data",
        "operational": "get_ops",
        "technical": "technical",
        "analytical": "analytical",
        "chatbot": "chatbot"
    }
)

graph_builder.add_edge("get_data", "data_formatter")
graph_builder.add_edge("data_formatter", "router")

graph_builder.add_edge("get_ops", "router")
graph_builder.add_edge("operational_data_formatter", "router")

graph_builder.add_edge("technical", "get_technical")
graph_builder.add_edge("get_technical", "router")

graph_builder.add_edge("analytical", "get_section")
graph_builder.add_edge("get_section", "router")

graph_builder.add_edge("chatbot", END)


graph = graph_builder.compile()


# ------------ Consultant Chatbot ------------

async def run_chatbot(query: str,client_id):
    """
    Processa uma consulta enviada pelo usuário e retorna a resposta gerada pelo chatbot.

    A função inicializa o banco de dados, monta o estado da conversa com o ID do cliente,
    adiciona a mensagem do usuário ao histórico, invoca o grafo de processamento e 
    retorna a última resposta gerada pela IA.

    Args:
        query (str): Pergunta ou mensagem enviada pelo usuário ao chatbot.
        client_id (str | int, optional): Identificador único do cliente/usuário para
                                         manter contexto da conversa. Padrão é 1.

    Returns:
        str: Texto da resposta gerada pelo chatbot.

    Raises:
        ValueError: Caso o processamento não gere nenhuma resposta da IA.
    """
    db = await initialize_db()
    state = {"messages": [], "client_id":client_id, "database": db}
    state["log"] = await get_chat_log(state)

    state['query'] = query

    state["messages"].append({"role": "user", "content": query})

    state: dict = graph.invoke(state)

    assistant_msgs = [m for m in state["messages"] if isinstance(m, AIMessage)]
    if assistant_msgs:
        await save_chat_log(state)
        return assistant_msgs[-1].content
    else:
        raise ValueError("Falha em processar resposta.")
