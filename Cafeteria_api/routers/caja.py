from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter(prefix="/caja", tags=["Caja"])

@router.get("/status")
def caja_status():
    return {"message": "Módulo de Caja funcionando correctamente"}