import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../../theme";

const tabs = [
  { id: "dashboardCocina", label: "Dashboard", icono: "⊞" },
  { id: "pedidos",         label: "Pedidos",   icono: "🍽️" },
  { id: "inventario",      label: "Inventario", icono: "📦" },
  { id: "menu",            label: "Menú",       icono: "≡" },
];

export default function BottomTabCocina({ pantallaActual, cambiarPantalla }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const activo = pantallaActual === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activo && styles.tabActivo]}
            onPress={() => cambiarPantalla(tab.id)}
          >
            <Text style={[styles.icono, activo && styles.iconoActivo]}>
              {tab.icono}
            </Text>
            <Text style={[styles.label, activo && styles.labelActivo]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    borderRadius: 12,
    gap: 2,
  },

  tabActivo: {
    backgroundColor: theme.colors.primary,
  },

  icono: {
    fontSize: 20,
    color: theme.colors.textSecondary,
  },

  iconoActivo: {
    color: "#fff",
  },

  label: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },

  labelActivo: {
    color: "#fff",
    fontWeight: "600",
  },
});