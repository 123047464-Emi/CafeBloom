import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../../theme";

const OrderCard = ({ item, onPress }) => {
  return (
    <View style={styles.fila}>

      {/* Círculo con número de mesa */}
      <View style={styles.circulo}>
        <Text style={styles.circuloTexto}>{item.mesa}</Text>
      </View>

      {/* Info central */}
      <View style={styles.info}>
        <Text style={styles.titulo}>
          Mesa {item.mesa} • {item.productos.length}{" "}
          {item.productos.length === 1 ? "ítem" : "ítems"}
        </Text>
        <Text style={styles.subtitulo}>
          Hace {item.tiempoEspera ?? item.hora}
        </Text>
      </View>

      {/* Badge — toca para abrir detalle */}
      <TouchableOpacity
        style={[
          styles.badge,
          {
            backgroundColor: item.urgente
              ? "#F4A57A"
              : item.estado === "Listo"
              ? "#6DBF9E"
              : item.estado === "Preparando"
              ? "#E8A0C8"
              : theme.colors.primary,
          },
        ]}
        onPress={onPress}
      >
        <Text style={styles.badgeTexto}>
          {item.urgente ? "Urgente" : item.estado}
        </Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  fila: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5E6E6",
  },
  circulo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  circuloTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  info: {
    flex: 1,
  },
  titulo: {
    fontWeight: "600",
    fontSize: 14,
    color: theme.colors.text,
  },
  subtitulo: {
    fontSize: 12,
    marginTop: 2,
    color: theme.colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  badgeTexto: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default OrderCard;