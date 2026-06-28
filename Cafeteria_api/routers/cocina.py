from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/cocina", tags=["Cocina"])

# INSUMOS
@router.post("/insumos", response_model=schemas.Insumo)
def crear_insumo(insumo: schemas.InsumoCreate, db: Session = Depends(get_db)):
    nuevo = models.InsumoModel(
        nombre=insumo.nombre, 
        stock=insumo.stock, 
        unidad=insumo.unidad,
        stockMinimo=insumo.stockMinimo
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/insumos", response_model=list[schemas.Insumo])
def listar_insumos(db: Session = Depends(get_db)):
    return db.query(models.InsumoModel).all()

#PRODUCTOS 
@router.post("/productos", response_model=schemas.Producto)
def crear_producto(producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    nuevo = models.ProductoModel(
        nombre=producto.nombre,
        precio=producto.precio,
        descripcion=producto.descripcion,
        idCategoria=producto.idCategoria,
        idPromocion=producto.idPromocion
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# RECETAS 
@router.post("/recetas", response_model=schemas.RecetaProducto)
def crear_receta(receta: schemas.RecetaProductoCreate, db: Session = Depends(get_db)):
    nuevo = models.RecetaProductoModel(
        idProducto=receta.idProducto,
        idInsumo=receta.idInsumo,
        cantidad=receta.cantidad
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

#  PREPARAR PRODUCTO
@router.post("/preparar/{producto_id}")
def preparar_producto(producto_id: int, db: Session = Depends(get_db)):
    recetas = db.query(models.RecetaProductoModel).filter(models.RecetaProductoModel.idProducto == producto_id).all()
    if not recetas:
        raise HTTPException(status_code=404, detail="No se encontró una receta para este producto")
    
    # Validar stock suficiente antes de descontar
    for r in recetas:
        insumo = db.query(models.InsumoModel).filter(models.InsumoModel.id == r.idInsumo).first()
        if not insumo or insumo.stock < r.cantidad:
            raise HTTPException(status_code=400, detail=f"Stock insuficiente para el insumo ID: {r.idInsumo}")
            
    # Descontar del inventario
    for r in recetas:
        insumo = db.query(models.InsumoModel).filter(models.InsumoModel.id == r.idInsumo).first()
        insumo.stock -= r.cantidad
        
    db.commit()
    return {"status": "success", "message": "Insumos descontados correctamente"}

# ESTADÍSTICAS
@router.get("/estadisticas")
def obtener_estadisticas(db: Session = Depends(get_db)):
    # Mapeo numérico de estatus: 1 = Pendiente, 2 = Preparando, 3 = Listo
    activos = db.query(models.PedidoModel).filter(models.PedidoModel.idEstatus == 1).count()
    preparando = db.query(models.PedidoModel).filter(models.PedidoModel.idEstatus == 2).count()
    listos = db.query(models.PedidoModel).filter(models.PedidoModel.idEstatus == 3).count()
    
    return {
        "activos": activos,
        "preparando": preparando,
        "listos": listos
    }

# PEDIDOS 
@router.get("/pedidos")
def listar_pedidos_cocina(db: Session = Depends(get_db)):
    # Obtener pedidos activos en cocina
    pedidos_db = db.query(models.PedidoModel).filter(models.PedidoModel.idEstatus.in_([1, 2, 3])).all()
    
    mapa_estados = {1: "Pendiente", 2: "Preparando", 3: "Listo"}
    resultado = []
    
    for p in pedidos_db:
        # Buscar los productos correspondientes a este pedido
        detalles = db.query(models.DetallePedidoModel).filter(models.DetallePedidoModel.idPedido == p.id).all()
        productos_lista = []
        
        for d in detalles:
            prod = db.query(models.ProductoModel).filter(models.ProductoModel.id == d.idProducto).first()
            if prod:
                productos_lista.append({
                    "id": prod.id,
                    "nombre": prod.nombre,
                    "cantidad": d.cantidad
                })
        
        resultado.append({
            "id": p.id,
            "mesa": p.idMesa,
            "estado": mapa_estados.get(p.idEstatus, "Pendiente"),
            "hora": p.fecha if p.fecha else "10 mins",
            "productos": productos_lista,
            "urgente": True if p.idEstatus == 1 else False
        })
        
    return resultado

@router.post("/pedidos/{pedido_id}/estado")
def actualizar_estado_pedido(pedido_id: int, payload: dict, db: Session = Depends(get_db)):
    pedido = db.query(models.PedidoModel).filter(models.PedidoModel.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
        
    nuevo_estado_texto = payload.get("estado")
    mapa_estados = {"Pendiente": 1, "Preparando": 2, "Listo": 3}
    
    if nuevo_estado_texto not in mapa_estados:
        raise HTTPException(status_code=400, detail="Estado inválido enviado")
        
    pedido.idEstatus = mapa_estados[nuevo_estado_texto]
    db.commit()
    return {"status": "updated", "nuevo_estado": nuevo_estado_texto}

#  ACTUALIZAR/MODIFICAR INSUMO
@router.put("/insumos/{insumo_id}", response_model=schemas.Insumo)
def modificar_insumo(insumo_id: int, insumo_actualizado: schemas.InsumoCreate, db: Session = Depends(get_db)):
    # 1. Buscamos el insumo en la base de datos de Docker por su ID
    db_insumo = db.query(models.InsumoModel).filter(models.InsumoModel.id == insumo_id).first()
    
    # Si no existe, lanzamos un error 404
    if not db_insumo:
        raise HTTPException(status_code=404, detail="El insumo que intentas editar no existe")
    
    # 2. Reemplazamos los valores viejos por los nuevos que mandó el teléfono
    db_insumo.nombre = insumo_actualizado.nombre
    db_insumo.stock = insumo_actualizado.stock
    db_insumo.unidad = insumo_actualizado.unidad
    db_insumo.stockMinimo = insumo_actualizado.stockMinimo
    
    # 3. Guardamos los cambios en PostgreSQL
    db.commit()
    db.refresh(db_insumo)
    return db_insumo


# ELIMINAR INSUMO 
@router.delete("/insumos/{insumo_id}")
def eliminar_insumo(insumo_id: int, db: Session = Depends(get_db)):
    # 1. Buscamos el insumo en la base de datos
    db_insumo = db.query(models.InsumoModel).filter(models.InsumoModel.id == insumo_id).first()
    
    if not db_insumo:
        raise HTTPException(status_code=404, detail="El insumo que deseas eliminar no existe")
    
    # 2. Lo borramos de la tabla
    db.delete(db_insumo)
    db.commit()
    
    # Devolvemos un mensaje de éxito
    return {"ok": True, "message": f"Insumo con ID {insumo_id} eliminado con éxito"}