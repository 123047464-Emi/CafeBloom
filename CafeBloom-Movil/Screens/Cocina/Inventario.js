import React, { useEffect, useState } from "react";
import {SafeAreaView,View,Text,FlatList,TouchableOpacity,StyleSheet,Alert,Modal,TextInput,ScrollView,ActivityIndicator, Platform} from "react-native";
import theme from "../../theme";
import InventarioCard from "../../Components/Cocina/InventarioCard";
import { getInsumos, createInsumo, updateInsumo, deleteInsumo  } from "../../services/CocinaService";

if (Platform.OS === "web") {
  Alert.alert = (title, message, buttons) => {
    const confirmed = window.confirm(`${title}\n\n${message}`);

    if (confirmed && buttons) {
      const confirmBtn = buttons.find(b => b.style !== "cancel");
      confirmBtn?.onPress?.();
    }
  };
}

const Inventario = () => {
  const [insumos, setInsumos]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEditar, setModoEditar]     = useState(false);
  const [modoAgregar, setModoAgregar]   = useState(false);

  // campos editar
  const [stock, setStock]               = useState("");
  const [stockMinimo, setStockMinimo]   = useState("");

  // campos agregar
  const [nuevoNombre, setNuevoNombre]   = useState("");
  const [nuevoActual, setNuevoActual]   = useState("");
  const [nuevoMinimo, setNuevoMinimo]   = useState("");
  const [nuevoUnidad, setNuevoUnidad]   = useState("");

  // Carga Inventario desde la API
  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    try {
      setLoading(true);
      const data = await getInsumos();
      const adaptados = Array.isArray(data) ? data : [data];
      setInsumos(adaptados);
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  //abrir detalle del producto
  const abrirModal = (item) => {
    setSeleccionado(item);
    setStock(String(item.stock));
    setStockMinimo(String(item.stockMinimo));
    setModoEditar(false);
    setModoAgregar(false);
    setModalVisible(true);
  };

  // abrir modal agregar producto
  const abrirAgregar = () => {
    setNuevoNombre("");
    setNuevoActual("");
    setNuevoMinimo("");
    setNuevoUnidad("");
    setModoAgregar(true);
    setModoEditar(false);
    setSeleccionado(null);
    setModalVisible(true);
  };

  //guardar modificaciones
  const guardarEdicion = async () => {
    const actual = parseFloat(stock);
    const minimo = parseFloat(stockMinimo);

    if (isNaN(actual) || isNaN(minimo)) {
      Alert.alert("Error", "Los valores deben ser números válidos.");
      return;
    }
    if (actual < 0 || minimo < 0) {
      Alert.alert("Error", "Los valores no pueden ser negativos.");
      return;
    }

    Alert.alert(
      "Confirmar edición",
      `¿Guardar cambios en "${seleccionado.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Guardar",
          onPress: async () => {
            try {
              setModalVisible(false);
              setLoading(true);
              
              // Enviamos los campos al API usando el formato correcto de tu backend
              await updateInsumo(seleccionado.id, {
                nombre: seleccionado.nombre,
                stock: actual,
                unidad: seleccionado.unidad,
                stockMinimo: minimo
              });

              Alert.alert("Éxito", "Insumo actualizado correctamente.");
              await cargarInventario(); // Recarga la lista limpia de Docker
            } catch (error) {
              Alert.alert("Error", error.message);
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  //  guardar nuevo producto 
  const guardarNuevo = async () => {
    if (!nuevoNombre.trim()) {
      Alert.alert("Error", "El nombre del producto es obligatorio.");
      return;
    }
    const actual = parseFloat(nuevoActual);
    const minimo = parseFloat(nuevoMinimo);

    if (isNaN(actual) || isNaN(minimo)) {
      Alert.alert("Error", "Stock actual y mínimo deben ser números válidos.");
      return;
    }
    if (actual < 0 || minimo < 0) {
      Alert.alert("Error", "Los valores no pueden ser negativos.");
      return;
    }
    if (!nuevoUnidad.trim()) {
      Alert.alert("Error", "La unidad es obligatoria (ej: kg, L, pz).");
      return;
    }

    Alert.alert(
      "Confirmar producto",
      `¿Agregar "${nuevoNombre.trim()}" al inventario?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Agregar",
          onPress: async () => {
            try {
              setModalVisible(false);
              setLoading(true);

              await createInsumo({
                nombre: nuevoNombre.trim(),
                stock: actual,
                unidad: nuevoUnidad.trim(),
                stockMinimo: minimo
              });

              Alert.alert("Éxito", "Insumo guardado en la base de datos.");
              await cargarInventario();
            } catch (error) {
              Alert.alert("Error", error.message);
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // eliminar un producto
  const manejarEliminar = () => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Eliminar "${seleccionado.nombre}" del inventario de forma permanente?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setModalVisible(false);
              setLoading(true);

              await deleteInsumo(seleccionado.id);

              Alert.alert("Eliminado", "El insumo ha sido borrado.");
              await cargarInventario();
            } catch (error) {
              Alert.alert("Error", error.message);
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setModoEditar(false);
    setModoAgregar(false);
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.botonIcono}>
          <Text style={styles.iconoTexto}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Inventario</Text>
        {/* Botón para recargar manualmente */}
        <TouchableOpacity style={styles.botonIcono} onPress={cargarInventario}>
          <Text style={styles.iconoTexto}>↻</Text>
        </TouchableOpacity>
      </View>

      {/* Indicador de carga */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        /* Lista */
        <FlatList
          data={insumos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <InventarioCard item={item} onPress={() => abrirModal(item)} />
          )}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Botón agregar flotante */}
      <TouchableOpacity style={styles.botonAgregar} onPress={abrirAgregar}>
        <Text style={styles.botonAgregarTexto}>+ Agregar producto</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={cerrarModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContenido}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHandle} />

              {/* MODO AGREGAR */}
              {modoAgregar && (
                <>
                  <Text style={styles.modalTitulo}>Nuevo producto</Text>

                  <Text style={styles.inputLabel}>Nombre</Text>
                  <TextInput
                    style={styles.input}
                    value={nuevoNombre}
                    onChangeText={setNuevoNombre}
                    placeholder="Ej: Café molido"
                    placeholderTextColor={theme.colors.textSecondary}
                  />

                  <Text style={styles.inputLabel}>Unidad (kg, L, pz…)</Text>
                  <TextInput
                    style={styles.input}
                    value={nuevoUnidad}
                    onChangeText={setNuevoUnidad}
                    placeholder="Ej: kg"
                    placeholderTextColor={theme.colors.textSecondary}
                  />

                  <Text style={styles.inputLabel}>Stock actual</Text>
                  <TextInput
                    style={styles.input}
                    value={nuevoActual}
                    onChangeText={setNuevoActual}
                    keyboardType="numeric"
                    placeholder="Ej: 45"
                    placeholderTextColor={theme.colors.textSecondary}
                  />

                  <Text style={styles.inputLabel}>Stock mínimo</Text>
                  <TextInput
                    style={styles.input}
                    value={nuevoMinimo}
                    onChangeText={setNuevoMinimo}
                    keyboardType="numeric"
                    placeholder="Ej: 20"
                    placeholderTextColor={theme.colors.textSecondary}
                  />

                  <TouchableOpacity style={styles.botonPrimario} onPress={guardarNuevo}>
                    <Text style={styles.botonPrimarioTexto}>Agregar al inventario</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.botonCerrar} onPress={cerrarModal}>
                    <Text style={styles.botonCerrarTexto}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* MODO VER  */}
              {!modoAgregar && !modoEditar && seleccionado && (
                <>
                  <Text style={styles.modalTitulo}>{seleccionado.nombre}</Text>

                  <View style={styles.modalFila}>
                    <View>
                      <Text style={styles.inputLabel}>Stock Actual</Text>
                      <Text style={styles.modalValor}>
                        {seleccionado.stock} {seleccionado.unidad}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.inputLabel}>Stock Mínimo</Text>
                      <Text style={styles.modalValor}>
                        {seleccionado.stockMinimo} {seleccionado.unidad}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.botonPrimario}
                    onPress={() => setModoEditar(true)}
                  >
                    <Text style={styles.botonPrimarioTexto}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.botonEliminar} onPress={manejarEliminar}>
                    <Text style={styles.botonEliminarTexto}>Eliminar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.botonCerrar} onPress={cerrarModal}>
                    <Text style={styles.botonCerrarTexto}>Cerrar</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* MODO EDITAR */}
              {!modoAgregar && modoEditar && seleccionado && (
                <>
                  <Text style={styles.modalTitulo}>Editar {seleccionado.nombre}</Text>

                  <Text style={styles.inputLabel}>
                    Stock Actual ({seleccionado.unidad})
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={stock}
                    onChangeText={setStock}
                    keyboardType="numeric"
                    placeholder="Ej: 45"
                    placeholderTextColor={theme.colors.textSecondary}
                  />

                  <Text style={styles.inputLabel}>
                    Stock Mínimo ({seleccionado.unidad})
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={stockMinimo}
                    onChangeText={setStockMinimo}
                    keyboardType="numeric"
                    placeholder="Ej: 20"
                    placeholderTextColor={theme.colors.textSecondary}
                  />

                  <TouchableOpacity style={styles.botonPrimario} onPress={guardarEdicion}>
                    <Text style={styles.botonPrimarioTexto}>Guardar cambios</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.botonCerrar}
                    onPress={() => setModoEditar(false)}
                  >
                    <Text style={styles.botonCerrarTexto}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },

  botonIcono: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFE4E4",
    alignItems: "center",
    justifyContent: "center",
  },

  iconoTexto: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "bold",
  },

  titulo: {
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.bold,
    fontFamily: "ButlerBold",
    color: theme.colors.text,
  },

  lista: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 120,
  },

  botonAgregar: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
  },

  botonAgregarTexto: {
    color: "#fff",
    fontWeight: theme.fonts.weight.bold,
    fontSize: theme.fonts.size.md,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  modalContenido: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.lg,
    paddingBottom: 36,
    maxHeight: "85%",
  },

  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: theme.spacing.md,
  },

  modalTitulo: {
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },

  modalFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
  },

  modalValor: {
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.text,
    marginTop: 4,
  },

  inputLabel: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    marginTop: theme.spacing.sm,
  },

  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    backgroundColor: "#FFF9F9",
  },

  botonPrimario: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },

  botonPrimarioTexto: {
    color: "#fff",
    fontWeight: theme.fonts.weight.bold,
    fontSize: theme.fonts.size.md,
  },

  botonEliminar: {
    backgroundColor: "#F2D6E0",
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },

  botonEliminarTexto: {
    color: "#C0436A",
    fontWeight: theme.fonts.weight.bold,
    fontSize: theme.fonts.size.md,
  },

  botonCerrar: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },

  botonCerrarTexto: {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.md,
  },
});

export default Inventario;