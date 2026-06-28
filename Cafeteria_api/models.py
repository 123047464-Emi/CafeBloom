from sqlalchemy import Column, Integer, String, Float, ForeignKey
from database import Base

class ProductoModel(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    precio = Column(Float, nullable=False)
    descripcion = Column(String, nullable=True)
    idCategoria = Column(Integer, nullable=True)
    idPromocion = Column(Integer, nullable=True)


class InsumoModel(Base):
    __tablename__ = "insumos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    stock = Column(Float, nullable=False)
    unidad = Column(String, nullable=True)
    stockMinimo = Column(Float, nullable=True)


class RecetaProductoModel(Base):
    __tablename__ = "recetas_productos"

    id = Column(Integer, primary_key=True, index=True)
    idProducto = Column(Integer, ForeignKey("productos.id"))
    idInsumo = Column(Integer, ForeignKey("insumos.id"))
    cantidad = Column(Float, nullable=False)


class PedidoModel(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    idMesa = Column(Integer, nullable=False)
    idEstatus = Column(Integer, nullable=False)
    idMesero = Column(Integer, nullable=False)
    fecha = Column(String, nullable=True)


class DetallePedidoModel(Base):
    __tablename__ = "detalles_pedidos"

    id = Column(Integer, primary_key=True, index=True)
    idProducto = Column(Integer, ForeignKey("productos.id"))
    idPedido = Column(Integer, ForeignKey("pedidos.id"))
    cantidad = Column(Integer, nullable=False)
    subtotal = Column(Float, nullable=False)


class VentaModel(Base):
    __tablename__ = "ventas"

    id = Column(Integer, primary_key=True, index=True)
    idPedido = Column(Integer, ForeignKey("pedidos.id"))
    fecha = Column(String, nullable=True)


class PagoModel(Base):
    __tablename__ = "pagos"

    id = Column(Integer, primary_key=True, index=True)
    idMetodo = Column(Integer, nullable=False)
    idVenta = Column(Integer, ForeignKey("ventas.id"))
    fecha = Column(String, nullable=True)