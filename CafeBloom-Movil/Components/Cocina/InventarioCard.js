import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"; 
import theme from "../../theme";

const InventarioCard = ({ item, onPress }) => { 
  let estado, colorEstado, bgEstado;

  if (item.stock === 0) {
    estado = "Sin Stock";
    colorEstado = "#C0436A";
    bgEstado = "#F2D6E0";
  } else if (item.stock < (item.stockMinimo || 20)) {
    estado = "Stock Bajo";
    colorEstado = "#D4843A";
    bgEstado = "#FAE8D4";
  } else {
    estado = "Stock OK";
    colorEstado = "#3AAD7A";
    bgEstado = "#D4F0E4";
  }

  const progreso = item.stockMinimo
    ? Math.min(item.stock / item.stockMinimo, 1)
    : 1;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.headerCard}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <View style={[styles.badge, { backgroundColor: bgEstado }]}>
          <Text style={styles.badgeIcono}>◎</Text>
          <Text style={[styles.badgeTexto, { color: colorEstado }]}>{estado}</Text>
        </View>
      </View>

      <View style={styles.stockContainer}>
        <View>
          <Text style={styles.label}>Stock Actual</Text>
          <Text style={styles.valor}>{item.stock} {item.unidad || ""}</Text>
        </View>
        <View>
          <Text style={styles.label}>Stock Mínimo</Text>
          <Text style={styles.valor}>{item.stockMinimo || "—"} {item.unidad || ""}</Text>
        </View>
      </View>

      <View style={styles.barraFondo}>
        <View style={[styles.barraRelleno, { width: `${progreso * 100}%`, backgroundColor: colorEstado }]} />
      </View>
    </TouchableOpacity> 
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  headerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  nombre: {
    fontSize: theme.fonts.size.md,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.text,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 4,
  },
  badgeIcono: {
    fontSize: 11,
    color: "#888",
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: "600",
  },
  stockContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  valor: {
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.text,
  },
  barraFondo: {
    height: 6,
    backgroundColor: "#F0E6E6",
    borderRadius: 4,
    overflow: "hidden",
  },
  barraRelleno: {
    height: 6,
    borderRadius: 4,
  },
});

export default InventarioCard;
