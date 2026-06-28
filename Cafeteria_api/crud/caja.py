import models
from datetime import date

def generar_venta(db, pedido_id):
    venta = models.Venta(idPedido=pedido_id, fecha=date.today())
    db.add(venta)
    db.commit()
    db.refresh(venta)
    return venta

def registrar_pago(db, venta_id, metodo_id):
    pago = models.Pago(
        idVenta=venta_id,
        idMetodo=metodo_id,
        fecha=date.today()
    )
    db.add(pago)
    db.commit()