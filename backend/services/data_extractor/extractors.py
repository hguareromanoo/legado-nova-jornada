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


# Load Supabase db
async def initialize_db():
    db = SupabaseManager()
    await db.initialize()

    return db



# ====================================
#           Class Structure
# ====================================

# ------------ Chat Log ------------

class State(TypedDict):
    messages: Annotated[list, add_messages]
    doc_type: str
    output_model: Optional[type[BaseModel]]
    prompt: Optional[str]
    extracted_data: Optional[dict | BaseModel]
    database: SupabaseManager


# ------------ Enums ------------

class UF(str, Enum):
    AC = "AC"
    AL = "AL"
    AP = "AP"
    AM = "AM"
    BA = "BA"
    CE = "CE"
    DF = "DF"
    ES = "ES"
    GO = "GO"
    MA = "MA"
    MT = "MT"
    MS = "MS"
    MG = "MG"
    PA = "PA"
    PB = "PB"
    PR = "PR"
    PE = "PE"
    PI = "PI"
    RJ = "RJ"
    RN = "RN"
    RS = "RS"
    RO = "RO"
    RR = "RR"
    SC = "SC"
    SP = "SP"
    SE = "SE"
    TO = "TO"

class JuntaComercial(str, Enum):
    JUCESP = "JUCESP"    # São Paulo
    JUCEPA = "JUCEPA"    # Pará
    JUCEMG = "JUCEMG"    # Minas Gerais
    JUCRS = "JUCRS"      # Rio Grande do Sul
    JUCEB = "JUCEB"      # Bahia
    JUCERJA = "JUCERJA"  # Rio de Janeiro
    JUCEC = "JUCEC"      # Ceará
    JUCEMAT = "JUCEMAT"  # Mato Grosso
    JUCEPAR = "JUCEPAR"  # Paraná
    JUCEMA = "JUCEMA"    # Maranhão
    JUCEP = "JUCEP"      # Piauí
    JUCETINS = "JUCETINS" # Tocantins
    JUCERGS = "JUCERGS"   # Rio Grande do Sul (nome alternativo)
    JUCER = "JUCER"       # Algumas usam nome simplificado
    JUCESC = "JUCESC"     # Santa Catarina
    JUCERES = "JUCERES"   # Espírito Santo
    JUCEGO = "JUCEGO"     # Goiás
    JUCEPI = "JUCEPI"     # Piauí
    JUCEPB = "JUCEPB"     # Paraíba
    JUCERN = "JUCERN"     # Rio Grande do Norte
    JUCERO = "JUCERO"     # Rondônia
    JUCEAP = "JUCEAP"     # Amapá
    JUCEAM = "JUCEAM"     # Amazonas
    JUCESE = "JUCESE"     # Sergipe
    JUCEPE = "JUCEPE"     # Pernambuco
    JUCEAL = "JUCEAL"     # Alagoas
    JUCEPIAUI = "JUCEPIAUI" # Nome variante informal


# ------------ Personal Documents ------------

class RGModel(BaseModel):
    numero: str
    orgao_emissor: str
    estado_emissor: UF
    data_emissao: Optional[str] = None

class CPFModel(BaseModel):
    numero: str

class CertidaoNascimentoModel(BaseModel):
    nome: str
    data_nascimento: str
    cartorio: str
    livro: Optional[str] = None
    folha: Optional[str] = None
    termo: Optional[str] = None

class CertidaoCasamentoModel(BaseModel):
    nome_conjuge: str
    data_casamento: str
    cartorio: str
    regime_bens: Literal["Comunhão parcial", "Comunhão universal", "Separação total", "Participação final nos aquestos"]

class PactoAntenupcialModel(BaseModel):
    livro: Optional[str] = None
    folha: Optional[str] = None
    cartorio: str
    data: str

class CertidaoRegimeBensModel(BaseModel):
    regime_bens: Literal["Comunhão parcial", "Comunhão universal", "Separação total", "Participação final nos aquestos"]
    cartorio: str
    data: str

class ProcuracaoModel(BaseModel):
    outorgante: str
    outorgado: str
    finalidade: str
    cartorio: str
    data: str


# ------------ Realstate Documents ------------

class MatriculaImovelModel(BaseModel):
    numero_matricula: str
    cartorio: str
    endereco: str
    cep: str
    cidade: str
    estado: str
    proprietarios: List[str]
    descricao: Optional[str] = None
    area_total: Optional[str] = None

class CertidaoOnusReaisModel(BaseModel):
    numero_matricula: str
    cartorio: str
    possui_onus: bool
    detalhes_onus: Optional[str] = None

class CertidaoNegativaIPTUModel(BaseModel):
    numero_inscricao: str
    municipio: str
    possui_debitos: bool
    data_emissao: Optional[str] = None

class ContratoDoacaoImovelModel(BaseModel):
    doador: str
    donatario: str
    imovel: str
    tipo_documento: Literal["Escritura pública", "Instrumento particular"]
    cartorio: Optional[str] = None
    data: str

class LaudoAvaliacaoImovelModel(BaseModel):
    imovel: str
    valor_avaliado: str
    profissional_responsavel: str
    registro_profissional: str
    data: str


# ------------ Vehicle Documents ------------

class CRLVModel(BaseModel):
    placa: str
    renavam: str
    chassi: str
    proprietario: str
    marca_modelo: str
    ano: str
    uf: UF

class CertidaoNegativaVeiculoModel(BaseModel):
    placa: str
    possui_debitos: bool
    detalhes: Optional[str] = None


# ------------ Corporate Share Documents ------------

class ContratoSocialModel(BaseModel):
    nome_empresa: str
    cnpj: str
    numero_nire: Optional[str] = None
    junta_comercial: Optional[JuntaComercial] = None
    socios: List[str]
    participacoes: List[str]  # Descrever percentual

class TitularidadeCotasModel(BaseModel):
    nome_empresa: str
    cnpj: str
    titular: str
    percentual: str
    documento: Optional[str] = None


# ------------ Financial investments Documents ------------

class ExtratoInvestimentosModel(BaseModel):
    instituicao: str
    saldo_total: str
    tipos_investimento: List[str]
    data_extrato: Optional[str] = None

class ContaBancariaModel(BaseModel):
    banco: str
    agencia: str
    numero_conta: str
    tipo_conta: Literal["Corrente", "Poupança", "Investimento"]
    titular: str


# ------------ Other Documents ------------

class DeclaracaoBensModel(BaseModel):
    bens: List[str]
    valor_total_estimado: Optional[str] = None
    data: Optional[str] = None

class TestamentoModel(BaseModel):
    outorgante: str
    cartorio: str
    data: str
    detalhes: Optional[str] = None

class DefinicaoCapitalSocialModel(BaseModel):
    valor_total: str
    forma_integralizacao: str
    socios: List[str]
    percentual_por_socio: List[str]

class DocumentoContadorModel(BaseModel):
    nome: str
    crc: str
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None




#====================================
#               Agents
#====================================

# ------------ Output by document type ------------

output_format_dict = {
    "rg": RGModel,
    "cpf": CPFModel,
    "certidao_nascimento": CertidaoNascimentoModel,
    "certidao_casamento": CertidaoCasamentoModel,
    "pacto_antenupcial": PactoAntenupcialModel,
    "certidao_regime_bens": CertidaoRegimeBensModel,
    "procuracao": ProcuracaoModel,

    "matricula_imovel": MatriculaImovelModel,
    "certidao_onus_reais": CertidaoOnusReaisModel,
    "certidao_negativa_iptu": CertidaoNegativaIPTUModel,
    "contrato_doacao_imovel": ContratoDoacaoImovelModel,
    "laudo_avaliacao_imovel": LaudoAvaliacaoImovelModel,

    "crlv": CRLVModel,
    "certidao_negativa_veiculo": CertidaoNegativaVeiculoModel,

    "contrato_social": ContratoSocialModel,
    "titularidade_cotas": TitularidadeCotasModel,

    "extrato_investimentos": ExtratoInvestimentosModel,
    "conta_bancaria": ContaBancariaModel,

    "declaracao_bens": DeclaracaoBensModel,
    "testamento": TestamentoModel,
    "definicao_capital_social": DefinicaoCapitalSocialModel,
    "documento_contador": DocumentoContadorModel,
}


# ------------ Router ------------

def router(state: State):
    doc_type = "_".join(state["doc_type"].lower().strip().split())

    if doc_type in prompts_dict:
        prompt = prompts_dict[doc_type]
    else:
        doc_type = get_type_by_similarity(doc_type)  # Semantic search for closest type
        prompt = prompts_dict.get(doc_type)

    output_model = output_format_dict[doc_type]

    state['output_model'] = output_model
    state['prompt'] = prompt
    state['doc_type'] = doc_type

    return state


# ------------ Extractor ------------

def extract_data_agent(state: State):
    structured_output = state.get("output_model")
    prompt = state.get("prompt")

    last_message = state["messages"][-1]
    extractor_llm = llm.with_structured_output(structured_output)

    response = extractor_llm.invoke([
        {"role": "system", "content": prompt},
        {"role": "user", "content": last_message.content}
    ])

    state['extracted_data'] = response
    return state


#====================================
#               Graphs
#====================================

graph_builder = StateGraph(State)

graph_builder.add_node("router", router)
graph_builder.add_node("extractor", extract_data_agent)

graph_builder.add_edge(START, "router")
graph_builder.add_edge("router", "extractor")
graph_builder.add_edge("extractor", END)

graph = graph_builder.compile()


# Main pipeline
async def run_data_extraction_process(user_id: str, doc_id: str, doc_type: str, path: str):
    """
    ## Graph-based Data Extractor

    Loads and formats a PDF document from the given path, runs a LangGraph agent pipeline 
    for data extraction, and inserts all extracted key-value pairs into the document_data table.

    Args:
        user_id (str): UUID of the user profile.
        doc_id (str): UUID of the document recommendation.
        doc_type (str): Type of document (to condition agent behavior).
        path (str): Local path to the PDF file.

    Returns:
        Dict[str, Any]: Dictionary of extracted key-value pairs.
    """
    db = await initialize_db()
    document_content ="\n".join([page.page_content.strip() for page in PyMuPDFLoader(path).load()])

    state = {"messages": [{"role": "user", "content": document_content}], "doc_type": doc_type, "database": db}

    state = graph.invoke(state)

    if not state.get("messages"):
        raise ValueError("Valor retornado inválido: mensagens estão vazias ou nulas.")
    
    extracted: BaseModel = state.get("extracted_data")
    if extracted is None:
        raise ValueError("Extração falhou: extracted_data é None.")
    
    data = extracted.model_dump()

    for data_key, data_value in data.items():
        await db.insert(table="document_data", data={
            "document_id": doc_id,
            "profile_id": user_id,
            "data_key": data_key,
            "data_value": str(data_value)
            }
        )

    return data