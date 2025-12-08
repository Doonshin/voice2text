from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# ========= REQUEST MODELS =========

class LoginRequest(BaseModel):
    email: str
    password: str


class SummaryRequest(BaseModel):
    transcript_id: str
    text: str


# ========= RESPONSE MODELS =========

class TranscriptMeta(BaseModel):
    id: int
    name: str
    created_at: datetime
    transcript: Optional[str] = None
    summary: Optional[str] = None


class TranscriptList(BaseModel):
    files: List[TranscriptMeta]


# ========= INTERNAL FILE STORE =========

FILES_DB = []  

class FileRecord:
    """Represents a stored uploaded file and results."""

    def __init__(self, name: str, storage_path: str):
        self.id = len(FILES_DB) + 1
        self.name = name
        self.path = storage_path
        self.created_at = datetime.now()
        self.text = None   # transcription text
        self.summary = None

    def to_meta(self) -> TranscriptMeta:
        """Convert internal record to serializable API response"""
        return TranscriptMeta(
            id=self.id,
            name=self.name,
            created_at=self.created_at,
            transcript=self.text,
            summary=self.summary,
        )
