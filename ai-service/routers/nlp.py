from fastapi import APIRouter
from pydantic import BaseModel
from services.korean_nlp import (
    analyze_korean_text,
    extract_vocabulary,
    detect_speech_level,
    extract_particles
)

router = APIRouter()

class TextRequest(BaseModel):
    text: str
    clipId: str = None  # optional clip reference

@router.post("/analyze")
def analyze_text(request: TextRequest):
    """
    Full Korean text analysis
    Called when new K-Drama clip subtitle is processed
    """
    return {
        "text": request.text,
        "morphemes": analyze_korean_text(request.text),
        "vocabulary": extract_vocabulary(request.text),
        "speechLevel": detect_speech_level(request.text),
        "particles": extract_particles(request.text)
    }

@router.post("/extract-vocabulary")
def get_vocabulary(request: TextRequest):
    """
    Extract vocab words from subtitle line
    Spring Boot calls this when processing new clip
    """
    vocab = extract_vocabulary(request.text)
    return {
        "clipId": request.clipId,
        "extracted": vocab,
        "count": len(vocab)
    }

@router.post("/speech-level")
def get_speech_level(request: TextRequest):
    """
    Detect formal/informal Korean
    Used to tag vocabulary appropriately
    """
    return {
        "text": request.text,
        "level": detect_speech_level(request.text),
        "explanation": "존댓말 (formal)" 
                       if detect_speech_level(request.text) 
                       == "formal" 
                       else "반말 (informal)"
    }