from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import crud.mesero as crud

router = APIRouter(prefix="/mesero", tags=["Mesero"])

@router.post("/pedido")
def crear_pedido(idMesa: int, idMesero: int, db: Session = Depends(get_db)):
    return crud.crear_pedido(db, idMesa, idMesero)

@router.post("/agregar")
def agregar(pedido_id: int, producto_id: int, cantidad: int, db: Session = Depends(get_db)):
    crud.agregar_producto(db, pedido_id, producto_id, cantidad)
    return {"ok": True}