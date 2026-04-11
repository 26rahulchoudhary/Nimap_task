from pydantic import BaseModel

class DocumentCreate(BaseModel):
    title: str
    company_name: str
    document_type: str

class DocumentOut(BaseModel):
    document_id: int
    title: str
    company_name: str
    document_type: str
    file_path: str

    class Config:
        from_attributes = True