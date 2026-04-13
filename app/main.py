from fastapi import FastAPI
from app.database import engine, Base
from app.models import User
from app.routes import auth, roles, documents, rag
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Create DB tables
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Financial Document API is running"}
app.include_router(auth.router)
app.include_router(roles.router)
app.include_router(documents.router)
app.include_router(rag.router)