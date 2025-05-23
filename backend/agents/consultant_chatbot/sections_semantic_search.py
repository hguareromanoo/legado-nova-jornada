from sentence_transformers import CrossEncoder
from functools import lru_cache
from typing import Literal
from services import get_collection, client
from sentence_transformers import SentenceTransformer, util
from torch import topk
from pydantic import BaseModel

bi_encoder = SentenceTransformer("intfloat/multilingual-e5-base")

@lru_cache
def load_cross_encoder():
    return CrossEncoder("cross-encoder/ms-marco-MiniLM-L6-v2")



def get_by_similarity(client_id, search: Literal['title', 'document_type'], input: str, top_k: int = 5, threshold: float = 0.65):
    collection = get_collection(client=client, client_id=client_id)

    # Filters search
    items = collection.get(
        where={search: {'$ne': None}}
    )["metadatas"]
    items = [item[search] for item in items if item.get(search)]

    # BiEncode search
    metadata_embeddings = bi_encoder.encode(
    [f"passage: {t}" for t in items],
    convert_to_tensor=True,
    )

    query_embedding = bi_encoder.encode(
    f"query: {input}",
    convert_to_tensor=True,
    )
    
    results = util.dot_score(query_embedding, metadata_embeddings)
    top_values, top_indices = topk(results, k=top_k, dim=1)

    top_filters = [items[idx] for idx in top_indices.tolist()]

    # CrossEncoder rerank
    cross_encoder = load_cross_encoder()
    pairs = [(input, t) for t in top_filters]
    rerank_scores = cross_encoder.predict(pairs)

    reranked = sorted(list(zip(top_filters, rerank_scores)), key=lambda x: x[1], reverse=True)

    # Threshold
    if reranked[0][1] < threshold:
        raise ValueError(f"Nenhuma seção encontrada com confiança suficiente. Best_Score={reranked[0][0]:.2f}")

    return [item for item, score in reranked[:top_k]]



def search_sections(client_id, extracted_data: BaseModel, threshold: float = 0.65):
    "Get closest sections by infered filters and using BiEncoder and CrossEncoder similarity."
    collection = get_collection(client=client, client_id=client_id)

    section_filters = []
    for title in extracted_data.section.section_title:
        try:
            section_filters.extend(get_by_similarity(
                client_id=client_id,
                search="title",
                input=title
            ))
        except ValueError:
            continue

    type_filters = []
    for t in extracted_data.section.document_type:
        try:
            type_filters.extend(get_by_similarity(
                client_id=client_id,
                search="document_type",
                input=t,
                top_k=3
            ))
        except ValueError:
            continue

    query = "\n".join(extracted_data.sentence)

    cross_encoder = load_cross_encoder()

    # BiEncode
    results = collection.query(
        query_texts=[query],
        n_results=10,
        where={"$in": {"title": set(section_filters), "document_type": set(type_filters)}}
    )

    # Set pairs and scores using CrossEncode
    sections = results["documents"]
    pairs = [(query, t) for t in results['documents']]
    scores = cross_encoder.predict(pairs)

    reranked = sorted(list(zip(sections, results["metadatas"]["title"], scores)), key=lambda x: x[1], reverse=True)

    # Threshold
    best_match, best_score = reranked[0]
    if best_score < threshold:
        raise ValueError(f"Nenhuma seção encontrada com confiança suficiente. Score={best_score:.2f}")

    return [pair[0] for pair, _ in reranked[:3]]