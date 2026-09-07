"""
Consent router — POST /api/v1/consent/

Records what the user agreed to and when. Separates necessary from
optional consent per product principle P2 and RBI Digital Lending
Guidelines reference (portfolio-project assumption, not legally compliant).
"""

import hashlib
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.consent import ConsentRecord

router = APIRouter()


class ConsentRequest(BaseModel):
    necessary_consents: dict[str, bool]
    optional_consents: dict[str, bool] = {}
    consent_version: str = "v1.0"


class ConsentResponse(BaseModel):
    consent_id: str
    captured_at: str
    necessary_consents: dict[str, bool]
    optional_consents: dict[str, bool]
    prototype_note: str = (
        "This consent record uses synthetic data only. "
        "Not legally compliant. Educational prototype."
    )


@router.post("/", response_model=ConsentResponse)
def record_consent(
    payload: ConsentRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Record a consent decision. Hashes IP and UA for privacy —
    raw values are never stored per product principle P2.
    """
    # Hash IP and UA — never store raw values
    raw_ip = request.client.host if request.client else "unknown"
    raw_ua = request.headers.get("user-agent", "unknown")
    ip_hash = hashlib.sha256(raw_ip.encode()).hexdigest()[:16]
    ua_hash = hashlib.sha256(raw_ua.encode()).hexdigest()[:16]

    record = ConsentRecord(
        consent_version=payload.consent_version,
        necessary_consents=payload.necessary_consents,
        optional_consents=payload.optional_consents,
        ip_hash=ip_hash,
        user_agent_hash=ua_hash,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return ConsentResponse(
        consent_id=record.consent_id,
        captured_at=record.captured_at.isoformat(),
        necessary_consents=record.necessary_consents,
        optional_consents=record.optional_consents,
    )


@router.delete("/{consent_id}/optional")
def withdraw_optional_consent(consent_id: str, db: Session = Depends(get_db)):
    """
    Withdraw optional consent — sets withdrawn_at timestamp.
    Necessary consents cannot be withdrawn (they are required to process
    the application). This implements product principle P2 withdrawal path.
    """
    record = db.query(ConsentRecord).filter(
        ConsentRecord.consent_id == consent_id
    ).first()

    if not record:
        from app.core.exceptions import NotFoundError
        raise NotFoundError("Consent record")

    record.withdrawn_at = datetime.now(timezone.utc)
    # Clear optional consents on withdrawal
    record.optional_consents = {}
    db.commit()

    return {
        "consent_id": consent_id,
        "withdrawn_at": record.withdrawn_at.isoformat(),
        "message": "Optional consents withdrawn. Necessary consents remain active for application processing.",
    }
