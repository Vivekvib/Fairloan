from fastapi import APIRouter
router = APIRouter()
@router.get("/faq")
def get_faq():
    return {"message": "FAQ endpoint — coming in Phase 1 build."}
