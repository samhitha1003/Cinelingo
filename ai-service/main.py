from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import nlp, pronunciation

app = FastAPI(
    title="CineLingo AI Service",
    description="Korean NLP and Pronunciation Scoring",
    version="1.0.0"
)

# Allow Spring Boot and React to call this
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React
        "http://localhost:8081"   # Spring Boot
    ],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(nlp.router, prefix="/api/nlp")
app.include_router(
    pronunciation.router,
    prefix="/api/pronunciation"
)

@app.get("/")
def health_check():
    return {
        "status": "CineLingo AI Service Running",
        "port": 8000
    }