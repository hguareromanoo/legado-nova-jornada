from typing import Literal, Annotated, List, Optional, Dict, Any
from langgraph.graph.message import add_messages
from langgraph.graph import StateGraph, END, START
from langchain.chat_models import init_chat_model
from langchain_community.document_loaders import PyMuPDFLoader
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from typing_extensions import TypedDict
from enum import Enum
from services.data_extractor.type_similarity_search import get_type_by_similarity
from services.data_extractor.templates import prompts_dict
from database.manager import SupabaseManager

load_dotenv()

llm = init_chat_model(
    "gpt-4o",
    model_provider="openai"
)


# ========================================================================
#           Class Structure
# ========================================================================

# ------------ Section Extractor ------------

class SectionExtractorModel(BaseModel):
    sections: List[Dict[Literal["content", "title"], str]]


# ------------ Summarier Agent ------------

class SummarierModel(BaseModel):
    summary: List[str]


# ------------ Chat Log ------------

class State(TypedDict):
    messages: Annotated[list, add_messages]
    sections: Optional[SectionExtractorModel]
    summary: Optional[SummarierModel]
    document: str




# ========================================================================
#                           Agents and Functions
# ========================================================================

# ------------ Extractor Agent ------------

def section_extractor_agent(state: State):
    extractor_llm = llm.with_structured_output(SectionExtractorModel)

    sections = extractor_llm.invoke([
        {"role": "system", "content": """
            Você é um assistente especializado na análise de documentos. Sua tarefa é dividir o texto fornecido em seções relevantes, identificando claramente o título e o conteúdo de cada seção.

            - Extraia os títulos das seções e seus respectivos conteúdos.
            - Ignore qualquer elemento que não faça parte do corpo do documento, como:
            - Cabeçalhos
            - Rodapés
            - Numeração de páginas
            - Assinaturas
            - Dados administrativos sem relevância para o conteúdo
            - As seções devem ser coesas e corresponder aos tópicos principais ou divisões naturais do documento.

            Garanta que cada item extraído contenha:
            - `title`: O título da seção.
            - `content`: O texto completo que pertence àquela seção.

            Se não houver um título explícito, deduza um título curto, descritivo e representativo para o conteúdo.

            Responda apenas com os dados solicitados no formato estruturado.
        """},
        {"role": "user", "content": state["document"]}
    ])

    state['sections'] = sections
    return state


# ------------ Summarier Agent ------------

def summarier_agent(state: State):
    summarier_llm = llm.with_structured_output(SummarierModel)

    summaries = summarier_llm.invoke([
        {"role": "system", "content": """
            Você é um assistente especialista em sumarização de textos complexos. Sua tarefa é gerar um resumo conciso e claro para cada uma das seções fornecidas.

            - Utilize o título e o conteúdo de cada seção como contexto.
            - O resumo deve capturar os pontos principais, informações essenciais e elementos chave da seção.
            - Ignore detalhes redundantes, textos legais padronizados ou informações pouco relevantes.

            Para cada seção, forneça:
            - `summary`: Um resumo objetivo do conteúdo da seção.

            Foque em clareza, precisão e objetividade.
        """},
        {"role": "user", "content": "\n\n".join([
            f"{sec['title'].upper()}\n\n{sec['content']}"
            for sec in state["sections"].sections
        ])}
    ])

    state['summary'] = summaries
    return state




# ========================================================================
#                               Graphs
# ========================================================================

graph_builder = StateGraph(State)

graph_builder.add_node("extractor_agent", section_extractor_agent)
graph_builder.add_node("summarier_agent", summarier_agent)

graph_builder.add_edge(START, "extractor_agent")
graph_builder.add_edge("extractor_agent", "summarier_agent")
graph_builder.add_edge("summarier_agent", END)

graph = graph_builder.compile()


# Main pipeline
def extract_sections_and_embed(user_id, doc_type: str, path: str) -> List[dict]:
    document_content ="\n".join([page.page_content.strip() for page in PyMuPDFLoader(path).load()])

    state = {"messages": [{"role": "user", "content": document_content}], "doc_type": doc_type}

    state = graph.invoke(state)

    docs = []
    for s in state["sections"].sections:
        sec = {}
        sec["content"] = s["content"]
        sec["metadatas"] = {"title": s["title"]}
        sec["metadatas"]["user_id"] = user_id
        sec["metadatas"]["document_type"] = doc_type 
        docs.append(sec)

    for sec, summary in zip(docs, state["summary"].summary):
        sec["metadatas"]["summary"] = summary

    return docs