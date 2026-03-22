import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
import enum

from src.services.db import Base

class RoleEnum(str, enum.Enum):
    user = 'user'
    assistant = 'assistant'

class Document(Base):
    __tablename__ = 'documents'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filename = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    metadata_ = Column("metadata", JSONB, default=dict)
    # Using 1536 as default dimension for text-embedding-3-small/text-embedding-ada-002
    embedding = Column(Vector(1536))

class Conversation(Base):
    __tablename__ = 'conversations'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    title = Column(String, nullable=True)

    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = 'messages'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey('conversations.id'), nullable=False)
    role = Column(SQLEnum(RoleEnum), nullable=False)
    content = Column(Text, nullable=False)
    sources = Column(JSONB, nullable=True)  # Array of Document IDs or snippets
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    conversation = relationship("Conversation", back_populates="messages")
