from sentence_transformers import CrossEncoder
from templates import prompts_dict
from functools import lru_cache



@lru_cache
def load_cross_encoder():
    return CrossEncoder("cross-encoder/ms-marco-MiniLM-L6-v2")



def get_type_by_similarity(doc_type: str, threshold: float = 0.60):

    # Document types in system
    types = list(prompts_dict.keys())
    cross_encoder = load_cross_encoder()


    # Set pairs and scores
    pairs = [(doc_type, t) for t in types]
    scores = cross_encoder.predict(pairs)

    reranked = sorted(list(zip(types, scores)), key=lambda x: x[1], reverse=True)

    # Fallback
    best_match, best_score = reranked[0]
    if best_score < threshold:
        raise ValueError(f"Nenhum tipo encontrado com confiança suficiente. Score={best_score:.2f}")

    return reranked[0][0]