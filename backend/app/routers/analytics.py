from fastapi import APIRouter
router = APIRouter()
@router.post("/event")
def record_event():
    return {"message": "Analytics endpoint — coming in Phase 1 build."}
