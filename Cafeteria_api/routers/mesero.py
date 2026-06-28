from fastapi import APIRouter, Depends
from database import SessionLocal
import crud.mesero as crud

router = APIRouter(prefix="/mesero")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/pedido")
def crear_pedido(idMesa: int, idMesero: int, db=Depends(get_db)):
    return crud.crear_pedido(db, idMesa, idMesero)

@router.post("/agregar")
def agregar(pedido_id: int, producto_id: int, cantidad: int, db=Depends(get_db)):
    crud.agregar_producto(db, pedido_id, producto_id, cantidad)
    return {"ok": True}