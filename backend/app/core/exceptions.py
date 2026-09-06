"""
Custom HTTP exceptions with consistent error shapes.
All error responses follow: { "error": str, "detail": str }
"""

from fastapi import HTTPException


class NotFoundError(HTTPException):
    def __init__(self, resource: str):
        super().__init__(status_code=404, detail=f"{resource} not found.")


class ValidationError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=422, detail=detail)


class PrototypeConstraintError(HTTPException):
    """
    Raised when a request would violate a prototype safety constraint —
    e.g. attempting to store real PAN or Aadhaar data.
    """
    def __init__(self, detail: str = "This action is not permitted in the prototype."):
        super().__init__(status_code=403, detail=detail)
