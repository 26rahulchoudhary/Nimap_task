from fastapi import FastAPI
from app.database import engine, Base
from app.models import User

app = FastAPI()

# Create DB tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Financial Document API is running"}
