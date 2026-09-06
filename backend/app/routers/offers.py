"""Offers router — Phase 1 implementation coming in next session."""
from fastapi import APIRouter
router = APIRouter()

@router.get("/{save_token}")
def get_offer(save_token: str):
    return {"message": "Offers endpoint — coming in Phase 1 build.", "save_token": save_token}
