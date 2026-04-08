import whisper
import librosa
import numpy as np
import tempfile
import os

# Load Whisper model once on startup
# 'base' model is fast, 'large' is most accurate
model = whisper.load_model("base")

def transcribe_korean(audio_path: str):
    """
    Use Whisper to transcribe Korean audio
    More accurate than Web Speech API
    """
    result = model.transcribe(
        audio_path,
        language="ko",  # Korean
        task="transcribe"
    )
    return {
        "text": result["text"],
        "confidence": result.get("confidence", 0)
    }

def score_pronunciation(
    audio_path: str,
    expected_text: str
):
    """
    Score pronunciation against expected Korean text
    Returns 0-100 score
    """
    # Step 1: Transcribe what user said
    transcription = transcribe_korean(audio_path)
    spoken_text = transcription["text"].strip()
    
    # Step 2: Character-level similarity
    accuracy = calculate_similarity(
        spoken_text,
        expected_text
    )
    
    # Step 3: Audio quality analysis
    audio_score = analyze_audio_quality(audio_path)
    
    # Step 4: Combined score
    final_score = (accuracy * 0.7) + (audio_score * 0.3)
    
    return {
        "expectedText": expected_text,
        "spokenText": spoken_text,
        "accuracyScore": round(accuracy * 100, 1),
        "audioQualityScore": round(audio_score * 100, 1),
        "finalScore": round(final_score * 100, 1),
        "feedback": generate_feedback(final_score)
    }

def calculate_similarity(spoken: str, expected: str):
    """
    Character-level similarity scoring
    Same logic as game's fuzzy matching
    but more precise
    """
    if not spoken or not expected:
        return 0.0
    
    longer = spoken if len(spoken) > len(expected) \
             else expected
    shorter = spoken if len(spoken) <= len(expected) \
              else expected
    
    if len(longer) == 0:
        return 1.0
    
    matches = sum(
        1 for char in shorter if char in longer
    )
    return matches / len(longer)

def analyze_audio_quality(audio_path: str):
    """
    Analyze audio using librosa
    Check pitch, energy, clarity
    """
    y, sr = librosa.load(audio_path)
    
    # RMS energy (volume consistency)
    rms = librosa.feature.rms(y=y)[0]
    energy_score = min(1.0, np.mean(rms) * 10)
    
    # Zero crossing rate (clarity)
    zcr = librosa.feature.zero_crossing_rate(y)[0]
    clarity_score = 1.0 - min(1.0, np.mean(zcr) * 5)
    
    return (energy_score + clarity_score) / 2

def generate_feedback(score: float):
    if score >= 0.9:
        return "완벽해요! Perfect pronunciation! 🌟"
    elif score >= 0.7:
        return "잘했어요! Good job! Keep practicing! 👍"
    elif score >= 0.5:
        return "괜찮아요! Not bad! Try once more! 💪"
    else:
        return "다시 해봐요! Practice more! 화이팅! 🎯"