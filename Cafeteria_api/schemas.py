from pydantic import BaseModel
from typing import Optional


# PRODUCTO

class ProductoBase(BaseModel):
    nombre: str
    precio: float
    descripcion: Optional[str] = None
    idCategoria: Optional[int] = None
    idPromocion: Optional[int] = None

class ProductoCreate(ProductoBase):
    pass

class Producto(ProductoBase):
    id: int

    class Config:
        from_attributes = True



# INSUMO

class InsumoBase(BaseModel):
    nombre: str
    stock: float
    unidad: Optional[str] = None
    stockMinimo: Optional[float] = None

class InsumoCreate(InsumoBase):
    pass

class Insumo(InsumoBase):
    id: int

    class Config:
        from_attributes = True



# RECETA PRODUCTO

class RecetaProductoBase(BaseModel):
    idProducto: int
    idInsumo: int
    cantidad: float

class RecetaProductoCreate(RecetaProductoBase):
    pass

class RecetaProducto(RecetaProductoBase):
    id: int

    class Config:
        from_attributes = True



# PEDIDO

class PedidoBase(BaseModel):
    idMesa: int
    idEstatus: int
    idMesero: int
    fecha: Optional[str] = None

class PedidoCreate(PedidoBase):
    pass

class Pedido(PedidoBase):
    id: int

    class Config:
        from_attributes = True



# DETALLE PEDIDO

class DetallePedidoBase(BaseModel):
    idProducto: int
    idPedido: int
    cantidad: int
    subtotal: float

class DetallePedidoCreate(DetallePedidoBase):
    pass

class DetallePedido(DetallePedidoBase):
    id: int

    class Config:
        from_attributes = True



# VENTA

class VentaBase(BaseModel):
    idPedido: int
    fecha: Optional[str] = None

class VentaCreate(VentaBase):
    pass

class Venta(VentaBase):
    id: int

    class Config:
        from_attributes = True



# PAGO

class PagoBase(BaseModel):
    idMetodo: int
    idVenta: int
    fecha: Optional[str] = None

class PagoCreate(PagoBase):
    pass

class Pago(PagoBase):
    id: int

    class Config:
        from_attributes = True