import React, { useEffect, useState } from "react";
import {SafeAreaView,View,Text,FlatList,Modal,TouchableOpacity,Alert,ActivityIndicator,ScrollView,StyleSheet,} from "react-native";
import OrderCard from "../../Components/Cocina/OrderCard";
import theme from "../../theme";
import {getPedidos,updatePedidoEstado,} from "../../services/CocinaService";

const Pedidos = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  //  CARGAR PEDIDOS DESDE API
  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      setLoading(true);

      const data = await getPedidos();

      setOrders(data);

    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const openOrder = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  //  ACTUALIZAR ESTADO 
  const updateStatus = async (status) => {
    try {
      await updatePedidoEstado(selectedOrder.id, status);

      const updated = orders.map((o) =>
        o.id === selectedOrder.id ? { ...o, estado: status } : o
      );

      setOrders(updated);
      setSelectedOrder({ ...selectedOrder, estado: status });

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingTexto}>Cargando pedidos...</Text>
      </SafeAreaView>
    );
  }

  // Estados
  const pendientes = orders.filter((o) => o.estado === "Pendiente");
  const preparando = orders.filter((o) => o.estado === "Preparando");
  const listos = orders.filter((o) => o.estado === "Listo");
  const urgentes = orders.filter((o) => o.urgente);

  const estadisticas = [
    { label: "Pendientes", valor: pendientes.length, color: "#FF8C69", bg: "#FFF0EB" },
    { label: "Preparando", valor: preparando.length, color: "#E8A0C8", bg: "#FDF0F7" },
    { label: "Listos", valor: listos.length, color: "#6DBF9E", bg: "#EDF8F3" },
    { label: "Urgentes", valor: urgentes.length, color: "#F4A57A", bg: "#FFF4EE" },
  ];

  const secciones = [
    { titulo: "Urgentes", datos: urgentes },
    { titulo: "Pendientes", datos: pendientes },
    { titulo: "Preparando", datos: preparando },
    { titulo: "Listos", datos: listos },
  ].filter((s) => s.datos.length > 0);



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Encabezado */}
        <View style={styles.encabezado}>
          <Text style={styles.titulo}>Pedidos</Text>

          <View style={styles.totalBadge}>
            <Text style={styles.totalTexto}>{orders.length} activos</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridFila}>
            {estadisticas.slice(0, 2).map((e) => (
              <View key={e.label} style={[styles.tarjeta, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.tarjetaHeader}>
                  <Text style={styles.tarjetaLabel}>{e.label}</Text>
                </View>
                <Text style={[styles.tarjetaValor, { color: e.color }]}>{e.valor}</Text>
              </View>
            ))}
          </View>

          <View style={styles.gridFila}>
            {estadisticas.slice(2, 4).map((e) => (
              <View key={e.label} style={[styles.tarjeta, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.tarjetaHeader}>
                  <Text style={styles.tarjetaLabel}>{e.label}</Text>
                </View>
                <Text style={[styles.tarjetaValor, { color: e.color }]}>{e.valor}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Secciones */}
        {secciones.map((seccion) => (
          <View key={seccion.titulo} style={styles.seccionContainer}>
            <Text style={styles.seccionTitulo}>{seccion.titulo}</Text>

            <View style={styles.seccionCard}>
              {seccion.datos.map((item) => (
                <OrderCard
                  key={item.id}
                  item={item}
                  onPress={() => openOrder(item)}
                />
              ))}
            </View>
          </View>
        ))}

      </ScrollView>

      {/* MODAL*/}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContenido}>
            {selectedOrder && (
              <>
                <View style={styles.modalHandle} />

                <Text style={styles.modalTitulo}>
                  Mesa {selectedOrder.mesa}
                </Text>

                <Text style={styles.modalSubtitulo}>
                  Pedido #{selectedOrder.id}
                </Text>

                <Text style={styles.modalEstado}>
                  Estado: {selectedOrder.estado}
                </Text>

                <Text style={styles.modalSeccion}>Productos</Text>

                {selectedOrder.productos.map((p, i) => (
                  <Text key={i} style={styles.modalProducto}>
                    • {p.nombre} x{p.cantidad}
                  </Text>
                ))}

                <TouchableOpacity
                  onPress={() => updateStatus("Preparando")}
                  style={[styles.modalBoton, { backgroundColor: theme.colors.primary }]}
                >
                  <Text style={styles.modalBotonTexto}>Preparando</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => updateStatus("Listo")}
                  style={[styles.modalBoton, { backgroundColor: "#6DBF9E" }]}
                >
                  <Text style={styles.modalBotonTexto}>Listo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalCerrar}
                >
                  <Text style={styles.modalCerrarTexto}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Pedidos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  loadingTexto: {
    marginTop: 10,
    color: theme.colors.textSecondary,
  },

  // Encabezado
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  titulo: {
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.bold,
    fontFamily: "ButlerBold",
    color: theme.colors.text,
  },
  totalBadge: {
    backgroundColor: theme.colors.primary + "22",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    borderRadius: theme.radius.lg,
  },
  totalTexto: {
    color: theme.colors.primary,
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.bold,
  },

  // Grid estadísticas
  grid: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  gridFila: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  tarjeta: {
    flex: 1,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tarjetaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  tarjetaLabel: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    flexShrink: 1,
    marginRight: 4,
  },
  tarjetaIcono: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tarjetaValor: {
    fontSize: theme.fonts.size.xxl,
    fontWeight: theme.fonts.weight.bold,
  },

  // Secciones
  seccionContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  seccionTitulo: {
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  seccionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContenido: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.lg,
    paddingBottom: 36,
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
  },
  modalSubtitulo: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
    marginBottom: theme.spacing.sm,
  },
  modalEstado: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  modalSeccion: {
    fontSize: theme.fonts.size.md,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  modalProducto: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    marginBottom: 4,
  },
  modalBoton: {
    padding: 14,
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.lg,
    alignItems: "center",
  },
  modalBotonTexto: {
    color: "#fff",
    fontWeight: theme.fonts.weight.bold,
    fontSize: theme.fonts.size.md,
  },
  modalCerrar: {
    padding: 12,
    marginTop: theme.spacing.sm,
    alignItems: "center",
  },
  modalCerrarTexto: {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.md,
  },
});