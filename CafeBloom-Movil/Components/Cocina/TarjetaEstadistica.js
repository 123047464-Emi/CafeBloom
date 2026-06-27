import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../../theme";

export default function TarjetaEstadistica({ titulo, valor }) {
  return (
    <View style={styles.card}>
      <Text style={styles.valor}>{valor}</Text>
      <Text style={styles.titulo}>{titulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",

    marginHorizontal: 4,
  },

  valor: {
    fontSize: theme.fonts.size.xl,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weight.bold,
  },

  titulo: {
    marginTop: theme.spacing.xs,
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.sm,
    textAlign: "center",
  },
});