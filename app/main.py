from fastapi import FastAPI
from app.database import engine, Base
from app.models import User
from app.routes import auth, roles

app = FastAPI()

# Create DB tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Financial Document API is running"}
app.include_router(auth.router)
app.include_router(roles.router)