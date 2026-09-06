from fastapi import APIRouter
router = APIRouter()
@router.post("/")
def record_consent():
    return {"message": "Consent endpoint — coming in Phase 1 build."}
