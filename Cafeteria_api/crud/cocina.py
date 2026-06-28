from sqlalchemy.orm import Session
import models

#  CREAR INSUMO
def crear_insumo(db: Session, nombre: str, stock: int):
    nuevo = models.Insumo(
        nombre=nombre,
        stock=stock
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


#  CREAR PRODUCTO
def crear_producto(db: Session, nombre: str, precio: float):
    nuevo = models.Producto(
        nombre=nombre,
        precio=precio
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


#  CREAR RECETA
def crear_receta(db: Session, data: dict):
    receta = models.RecetaProducto(
        idProducto=data["idProducto"],
        idInsumo=data["idInsumo"],
        cantidad=data["cantidad"]
    )
    db.add(receta)
    db.commit()
    db.refresh(receta)
    return receta


# VALIDAR STOCK
def validar_stock(db, producto_id):
    recetas = db.query(models.RecetaProducto).filter_by(idProducto=producto_id).all()

    for r in recetas:
        insumo = db.query(models.Insumo).filter_by(id=r.idInsumo).first()
        if insumo.stock < r.cantidad:
            return False
    return True


#  DESCONTAR STOCK
def descontar_stock(db, producto_id):
    recetas = db.query(models.RecetaProducto).filter_by(idProducto=producto_id).all()

    for r in recetas:
        insumo = db.query(models.Insumo).filter_by(id=r.idInsumo).first()
        insumo.stock -= r.cantidad

    db.commit()


#  PREPARAR PRODUCTO
def preparar_producto(db, producto_id):
    if not validar_stock(db, producto_id):
        return {"error": "No hay suficiente stock"}

    descontar_stock(db, producto_id)
    return {"mensaje": "Producto preparado correctamente"}