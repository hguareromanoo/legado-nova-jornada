import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from typing import List, Dict
import os
from services.documents_section_processing.sections_extractor import extract_sections_and_embed

# Load the pre-trained SentenceTransformer model
embedding_model = SentenceTransformer("intfloat/multilingual-e5-base")

# Create chromadb client
client = chromadb.PersistentClient(path="./chroma_db")


def get_collection(client: chromadb.ClientAPI, client_id: str):
    """Creates or return a specific collection"""
    return client.get_or_create_collection(
        name=f"documents_sections::{client_id}",
        embedding_function=embedding_model,
        metadata={
            "type": "seções",
            "description": f"Coleção com seções extraídas dos arquivos pdf do cliente {client_id}"
        }
    )


def add_documents_to_chroma(chunks: List[Dict], collection: chromadb.Collection):
    """Prepares text and embeddings"""
    texts = [f"passage: {chunk['content']}" for chunk in chunks]
    metadatas = [chunk["metadatas"] for chunk in chunks]

    collection.add(
        documents=texts,
        metadatas=metadatas,
    )


# Main pipeline
def process_and_add_document(path: str, client_id: str, doc_type: str):

    if not os.path.exists(path):
        raise FileNotFoundError(f'Arquivo não encontrado: {path}')
    
    docs = extract_sections_and_embed(path, doc_id=client_id, doc_type=doc_type)

    collection = get_collection(client, client_id)
    add_documents_to_chroma(docs, collection)

    return collection