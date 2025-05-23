import os
import re
from typing import List, Dict
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_community.document_loaders import PyMuPDFLoader
import tiktoken
from dotenv import load_dotenv
from pprint import pprint


load_dotenv() # Load OpenAI pre-trainded LLM model
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_BASE = os.getenv("OPENAI_API_BASE")

# Low temperature for more objective answers
chat = ChatOpenAI(
    model="deepseek-reasoner",
    temperature=0.0,
    base_url=OPENAI_API_BASE,
    api_key=OPENAI_API_KEY
)


def call_llm_for_summary(section: Dict[str, str]):
    # Generates a summary for a given section of the document
    print("LLM está gernado o resumo...")
    return chat.invoke(
        [
            SystemMessage(content="Você é um especialista jurídico em contratos."),
            HumanMessage(
                content=f'''                
                Você receberá o título de uma seção e o conteúdo completo dessa seção, que pode conter subdivisões marcadas por títulos como "Alínea A)", "§1º", "Item 1", entre outros.

                Seu objetivo é:

                - Gerar um resumo **preciso**, **claro** e **conciso** do conteúdo enviado.
                - Manter o foco nas informações principais, especialmente nos pontos centrais das subdivisões.
                - Não inventar informações ou interpretar além do texto.
                - Preservar termos técnicos e jurídicos importantes.
                - Evitar detalhes excessivos, mas sem comprometer o sentido jurídico essencial.

                Formato do resumo:

                - Deve ser redigido em texto corrido, sem marcações XML ou markdown.
                - Pode mencionar as subdivisões para organizar o resumo, se necessário, mas sempre de forma breve e funcional.

                Atenção:

                - Os resumos devem capturar o ponto-chave de cada seção, e ter no máximo **400 caracteres**.
                - Use o title apenas para orientação; não infira nomes, datas ou termos que não constem explicitamente no conteúdo da seção.
                - Não inclua a contagem de caracteres no resumo.

                ---

                Título da seção: {section["title"]}

                Conteúdo da seção:

                {section["content"]}

                ---

                Resuma este conteúdo com precisão e concisão.
                '''
            )
        ]
    ).content



def normalize_llm_output(output: str | list[str | dict]) -> str:
    print("Normalizando o resumo...")
    if isinstance(output, str):
        return output.strip()

    elif isinstance(output, list):
        if all(isinstance(item, str) for item in output):
            return "\n".join(output).strip()

        elif all(isinstance(item, dict) for item in output):
            return "\n".join(
                f"{item.get('subdiv', '')}: {item.get('resumo', '')}"
                for item in output
            ).strip()

    return str(output).strip()  # fallback



def count_tokens_gpt3(text, model="gpt-3.5-turbo-0125"):
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))



def extract_sections_with_regex(text: str) -> List[Dict[str, str]]:
    # Compiles regex with marked sections based on common legal documents text's markers
    # <marker> for section title, <content> for section content.

    # Fallback
    sections = [{
            "title": "Documento integral",
            "content": text
        }]

    pattern = re.compile(
        r'''(?P<marker>
        (^|\n) 
        (CL[AÁ]USULA|CAP[IÍ]TULO|SE[CÇ][AÃ]O|ARTIGO|T[IÍ]TULO|PAR[AÁ]GRAFO|ANEXO|ACORDO|
        DECLARA[CÇ][AÃ]O|REQUERIMENTO|INSTRUMENTO|CONTRATO|PROCURA[CÇ][AÃ]O|ATA|TERMO|IM[OÓ]VEL|
        D[AO]S?\b\s+(OBJETO|ADMINISTRAÇÃO|CAPITAL SOCIAL|PRAZO|RESPONSABILIDADE|SÓCIOS|
        SUCESSÃO|ENDEREÇO|REMUNERAÇÃO|QUADRO SOCIETÁRIO|PARTICIPAÇÃO|ATIVIDADES))
        [^\n]{0,200})
        \n+
        (?P<content>.*?)
        (?=\n(?:
        CL[AÁ]USULA|CAP[IÍ]TULO|SE[CÇ][AÃ]O|ARTIGO|T[IÍ]TULO|PAR[AÁ]GRAFO|ANEXO|ACORDO|
        DECLARA[CÇ][AÃ]O|REQUERIMENTO|INSTRUMENTO|CONTRATO|PROCURA[CÇ][AÃ]O|ATA|TERMO|IM[OÓ]VEL|
        D[AO]S?\b\s+(OBJETO|ADMINISTRAÇÃO|CAPITAL SOCIAL|PRAZO|RESPONSABILIDADE|SÓCIOS|
        SUCESSÃO|ENDEREÇO|REMUNERAÇÃO|QUADRO SOCIETÁRIO|PARTICIPAÇÃO|ATIVIDADES))
        |\Z)''', flags=re.IGNORECASE | re.DOTALL | re.VERBOSE
    )

    matches = list(pattern.finditer(text))
    sections = []

    # Fallback: content before first marker
    if matches and matches[0].start() > 0:
        pre_section = text[:matches[0].start()].strip()
        sections.append({'title': 'PREÂMBULO OU INTRODUÇÃO', 'content': pre_section})

    # Markers ant content extraction
    for match in matches:
        marker = match.group('marker').strip()
        content = match.group('content').strip()
        sections.append({
            'title': marker.upper(),
            'content': content
        })

    # Fallback: zero markers were found
    if not sections:
        sections.append({
                "title": "documento integral".strip().upper(),
                "content": text.strip()
            })
    
    return sections



def extract_undetected_sections_with_regex(section: Dict[str, str]) -> List[Dict[str, str]]:
    # Try searching for less secure markers, which can lead to false positives
    # It is only called if there are still very large sections even after the initial sectioning
    pattern = re.compile(
        r'''(?P<marker>
        (^|\n) 
        (Certidão|Relatório|Recibo|Ofício|Comunicação|Notificação|Manifestação|Comunicado|Abertura|
        Memorando|Laudo|Ficha|Protocolo|Constituição|Distribuição de Cotas|Alteração Contratual|
        Administração|Designação de Sócio|Sucessão Patrimonial|Aporte de Capital|Entrada de Sócio|
        Saída de Sócio|Transferência de Quotas|Conferência de Bens|Apuração de Haveres|Definição|
        Encerramento|Responsabilidade|Regularidade|Situação Cadastral|Gestão de Bens|Patrimônio Familiar|
        Representação Legal|Reorganização|Holding Patrimonial|Holding Familiar|Leitura|Nomeação|Autorização|
        ENcerramento|Participações|Regulamento Interno|Governança|DISPOSIÇÕES FINAIS / GERAIS)
        [^\n]{0,200})
        \n+
        (?P<content>.*?)
        (?=\n(?:
        Certidão|Relatório|Recibo|Ofício|Comunicação|Notificação|Manifestação|Comunicado|Abertura|
        Memorando|Laudo|Ficha|Protocolo|Constituição|Distribuição de Cotas|Alteração Contratual|
        Administração|Designação de Sócio|Sucessão Patrimonial|Aporte de Capital|Entrada de Sócio|
        Saída de Sócio|Transferência de Quotas|Conferência de Bens|Apuração de Haveres|Definição|
        Encerramento|Responsabilidade|Regularidade|Situação Cadastral|Gestão de Bens|Patrimônio Familiar|
        Representação Legal|Reorganização|Holding Patrimonial|Holding Familiar|Leitura|Nomeação|Autorização|
        Encerramento|Participações|Regulamento Interno|Governança|DISPOSIÇÕES FINAIS / GERAIS)
        |\Z)''', flags=re.IGNORECASE | re.DOTALL | re.VERBOSE
    )

    new_sections = []
    matches = list(pattern.finditer(section["content"]))

    if matches:
        for match in matches:
            new_sections.append({
                'title': match.group('marker').strip().upper(),
                'content': match.group('content').strip()
            })
    else:
        new_sections.append(section) # Keeps the original section if nothing was detected

    return new_sections



def clean(text: str) -> str:
    # Pre-treatment for LLM markdown call
    # Removes lines brakers from PyMuPDF page's join
    text = re.sub(r'(?<=[a-záéíóúãõç0-9,;:])\n(?=[a-záéíóúãõç0-9])', ' ', text)
    # Normalizes multiple line breakers in two (for section division)
    text = re.sub(r"\n{2,}", "\n\n", text)
    # Remove indicators like [1] and (1) for less noise
    text = re.sub(r'[\[\(]\d+[\]\)]', '', text)
    return text



def treat_line_breaks_with_regex(text: str) -> str:
    # if the content before is [\)\w,;\-\u2013\u2014] (or white spaces) and the content after is [\(\w] (or white spaces), merge lines
    return re.sub(r'(?<=[\)\w,;\-\u2013\u2014])\s*\n\s*(?=[\(\w])', ' ', text)



def extract_subdivs_with_regex(content: str) -> List[Dict[str, str]]:
    # Before line breakers treatment, search for subdivisions in the content
    # return a list of all subdivisions found, even if it's None
    subdiv_pattern = re.compile(
        r"""(?P<marker>
        (^|\n)\s*        # Requires being in the start of the line
        (?=\S)           # Check if content after start is significant
        (              
        §\s*\d+[ºº]?                     |  # §1º or § 1º
        Al[ií]nea\s+[A-Z]\)?             |  # Alínea A
        Item\s+\d+                       |  # Item 1
        Inciso\s+[IVXLCDM]+\b            |  # Inciso I
        Subitem\s+\d+\b                  |  # Subitem 1
        Letra\s+\(?[a-zA-Z]\)?\b         |  # Letra a or Letra (a)
        [A-Z]\)                          |  # A), B)
        \d+\)                            |  # 1), 2)
        \(\d+\)                          |  # (1)
        \(\w\)                           |  # (a), (b)
        [IVXLCDM]+\.\s                   |  # II., X.
        [IVXLCDM]+\s?+[\-\u2013\u2014]\s |  # III -, VI -
        \d+\.\s                          |  # 1. 2. 3.
        [A-Z]+[\-\u2013\u2014]\s         |  # A -
        )
        )""", flags=re.DOTALL | re.IGNORECASE | re.VERBOSE
    )

    matches = list(subdiv_pattern.finditer(content))
    subdivs = []

    if matches:
        for i, match in enumerate(matches):
            start = match.start()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(content)

            marker = match.group("marker").strip()
            subdiv_content = content[start:end].strip()

            if not marker:
                continue

            subdivs.append({
                "marker": marker.upper(),
                "content": subdiv_content
            })

    return subdivs



# Get basetitle from sentence
def extract_basetitle_with_regex(sentence: str) -> List[str]:
    
    pattern = re.compile(
        r'''(?P<marker>
        (CL[AÁ]USULA|CAP[IÍ]TULO|SE[CÇ][AÃ]O|ARTIGO|T[IÍ]TULO|PAR[AÁ]GRAFO|ANEXO|ACORDO|
        DECLARA[CÇ][AÃ]O|REQUERIMENTO|INSTRUMENTO|CONTRATO|PROCURA[CÇ][AÃ]O|ATA|TERMO|IM[OÓ]VEL|
        D[AO]S?\b\s+(OBJETO|ADMINISTRAÇÃO|CAPITAL SOCIAL|PRAZO|RESPONSABILIDADE|SÓCIOS|
        SUCESSÃO|ENDEREÇO|REMUNERAÇÃO|QUADRO SOCIETÁRIO|PARTICIPAÇÃO|ATIVIDADES))
        )''', flags=re.IGNORECASE | re.DOTALL | re.VERBOSE
    )
    
    match = pattern.search(sentence)
    if match:
        print(match.group('marker').strip().upper())
        return match.group('marker').strip().upper()
    return sentence



def normalize_subdiv_title(title: str) -> str:
    # Remove parentheses, brackets, periods and all dashes
    title = re.sub(r"[()\[\]\.\-\u2013\u2014]", " ", title)
    # Remove multiple spaces and put them in uppercase
    title = re.sub(r"\s+", " ", title).strip().upper()
    return title



# Load a pdf document from PATH
def pdf_document_loader(path: str) -> str:
    docs = PyMuPDFLoader(path).load()

    return "\n".join([doc.page_content.strip() for doc in docs])



# Main pipeline
def document_treatment_pipeline(path: str, doc_id: str, doc_type: str) -> List[Dict]:
    '''
    Processes a PDF document to extract, clean, subdivide, and summarize its content.

    Steps:
    - Load and clean the document text.
    - Extract sections using regex.
    - For each section and subdivision, clean line breaks and generate a summary via LLM.
    - Store summaries and subdivisions metadatas in each section.

    Returns:
        List[Dict]: A list of sections with the following structure:
            {
                'content': str,               # Cleaned section text
                'id': str                     # Section ID: 'title::doc_ID::chunk_idx'
                'metadatas': {
                    'title': str              # Title extracted from section or subsection
                    'document_id': int        # Document ID
                    'document_type': str      # Document type
                    'summary': str,           # Section summary (optional in case of subdivisions)
                    'basetitle': str          # Basetitle extracted from title (relative title)
                    'type': str               # Section or subsection
                }
            }
    '''
    document_content = pdf_document_loader(path)
    document_content = clean(document_content)
    document_content = extract_sections_with_regex(document_content)

    # If the content its too large (~15 lines) and the document is not single divided
    if len(document_content) > 1 and any(count_tokens_gpt3(section['content']) > 200 for section in document_content):
        new_sections = []
        for section in document_content:
            if count_tokens_gpt3(section['content']) > 300:
                subdivided = extract_undetected_sections_with_regex([section])
                new_sections.extend(subdivided)
            else:
                new_sections.append(section)
        document_content = new_sections

    # Search for subdivisions and handles unnecessary line breaks, but can create unwanted joins
    # Create metadatas
    # Generate summary for each section
    for section in document_content:
        subdivs = extract_subdivs_with_regex(section["content"])
        section["metadatas"] = {}
        if subdivs:
            section["metadatas"]["subdivs"] = subdivs
        section["content"] = treat_line_breaks_with_regex(section['content'])
        section["metadatas"]["summary"] = normalize_llm_output(call_llm_for_summary(section))
        print("Resumo gerado e normalizado!")

    # Handles unecessary line breakers in subdivision content
    # Add subdivs titles and contents in document_content as sections
    subsections = []
    for idx, section in enumerate(document_content):
        subdivs: List[Dict] = section.get("metadatas", {}).pop("subdivs", [])
        if subdivs:
            for subdiv in subdivs:
                if subdiv:
                    subdiv["content"] = treat_line_breaks_with_regex(subdiv["content"])
                    # Subsection title as 'section title - subsection title'
                    subsections.append({
                        "title": f"{section['title']} - {normalize_subdiv_title(subdiv.get('marker'))}",
                        "content": subdiv["content"],
                        "metadatas": {
                            "basetitle": extract_basetitle_with_regex(section["title"]),
                            "section": "subsection"
                        }
                    })
    document_content.extend(subsections)

    # Generating metadata
    for idx, section in enumerate(document_content):
        # Metadata
        section["metadatas"]["title"] = section.pop("title")
        section["metadatas"]["document_type"] = doc_type
        section["metadatas"]["document_id"] = doc_id
        if not section["metadatas"].get("basetitle"):
            section["metadatas"]["basetitle"] = extract_basetitle_with_regex(section["metadatas"]["title"])
        if not section["metadatas"].get("type"):
            section["metadatas"]["type"] = "section"
        # Generates chunk ID
        id_parts = ["_".join(section["metadatas"]["title"].lower().strip().split())]
        id_parts.append(str(doc_id))
        id_parts.append(str(idx))
        section["id"] = "::".join(id_parts)

    pprint(document_content)

    return document_content 