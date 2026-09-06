"""Applications router — Phase 1 implementation coming in next session."""

from fastapi import APIRouter
router = APIRouter()

@router.get("/")
def list_applications():
    return {"message": "Applications endpoint — coming in Phase 1 build."}
