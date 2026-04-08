from fastapi import APIRouter, UploadFile, File, Form
from services.pronunciation_scorer import score_pronunciation
import tempfile
import os

router = APIRouter()

@router.post("/score")
async def score_user_pronunciation(
    audio: UploadFile = File(...),
    expectedText: str = Form(...),
    userId: str = Form(None)
):
    """
    Receive audio file from React frontend
    Score pronunciation against expected Korean text
    """
    # Save uploaded audio temporarily
    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".wav"
    ) as tmp:
        content = await audio.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        # Score the pronunciation
        result = score_pronunciation(tmp_path, expectedText)
        result["userId"] = userId
        return result
    finally:
        # Always clean up temp file
        os.unlink(tmp_path)

@router.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...)
):
    """
    Just transcribe without scoring
    Used for game alternative input
    """
    from services.pronunciation_scorer import \
        transcribe_korean
    
    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".wav"
    ) as tmp:
        content = await audio.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        result = transcribe_korean(tmp_path)
        return result
    finally:
        os.unlink(tmp_path)