const API_URL = "http://127.0.0.1:8000/cocina";

// UTILIDAD BASE
const request = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.detail || "Error en la petición");
    }
    return data;
  } catch (error) {
    throw new Error(error.message || "Error de conexión con el servidor");
  }
};

// INSUMOS
export const getInsumos = async () => {
  return await request(`${API_URL}/insumos`);
};

export const createInsumo = async (data) => {
  return await request(`${API_URL}/insumos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

// ACTUALIZAR INSUMO
export const updateInsumo = async (insumoId, data) => {
  return await request(`${API_URL}/insumos/${insumoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

//  ELIMINAR INSUMO
export const deleteInsumo = async (insumoId) => {
  return await request(`${API_URL}/insumos/${insumoId}`, {
    method: "DELETE",
  });
};

// PRODUCTOS 
export const createProducto = async (data) => {
  return await request(`${API_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

// RECETAS
export const createReceta = async (data) => {
  return await request(`${API_URL}/recetas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

//PREPARAR PRODUCTO 
export const prepararProducto = async (productoId) => {
  return await request(`${API_URL}/preparar/${productoId}`, {
    method: "POST",
  });
};

// ESTADÍSTICAS 
export const getEstadisticas = async () => {
  return await request(`${API_URL}/estadisticas`);
};

// PEDIDOS 
export const getPedidos = async () => {
  return await request(`${API_URL}/pedidos`);
};

export const updatePedidoEstado = async (pedidoId, nuevoEstado) => {
  return await request(`${API_URL}/pedidos/${pedidoId}/estado`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado: nuevoEstado }),
  });
};

