import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

// Screens
import LoginScreen from "../Screens/LoginScreen";
import DashboardCocina from "../Screens/Cocina/DashboardCocina";

const AppNavigator = () => {
  const [pantallaActual, setPantallaActual] = useState("login");

  const renderPantalla = () => {
    switch (pantallaActual) {
      case "login":
        return <LoginScreen cambiarPantalla={setPantallaActual} />;

      case "dashboardCocina":
        return <DashboardCocina />;

      case "dashboardMesero":
        return (
          <View style={styles.container}>
            <Text>Mesero</Text>
          </View>
        );

      case "dashboardCaja":
        return (
          <View style={styles.container}>
            <Text>Caja</Text>
          </View>
        );

      default:
        return <LoginScreen cambiarPantalla={setPantallaActual} />;
    }
  };

  return renderPantalla();
};

export default AppNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});