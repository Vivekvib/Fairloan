"""Support contact — MVP is static FAQ + mock form submission."""

import uuid
from sqlalchemy import Column, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.sql import func

from app.core.database import Base


class SupportContact(Base):
    __tablename__ = "support_contacts"

    contact_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=True)
    application_id = Column(String(36), ForeignKey("applications.application_id"), nullable=True)
    channel = Column(Enum("faq", "in_app_form", "email", name="support_channel"), nullable=False)
    subject = Column(String(200), nullable=True)
    message = Column(Text, nullable=True)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(
        Enum("open", "in_progress", "resolved", name="support_status"),
        nullable=False,
        default="open"
    )
    resolved_at = Column(DateTime(timezone=True), nullable=True)
