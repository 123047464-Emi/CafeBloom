import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import LoginScreen from "../Screens/LoginScreen";
import DashboardCocina from "../Screens/Cocina/DashboardCocina";
import BottomTabCocina from "../Components/Cocina/BottomTabCocina";
import Pedidos from "../Screens/Cocina/Pedidos";
import Inventario from "../Screens/Cocina/Inventario";

const pantallasCocina = ["dashboardCocina", "pedidos", "inventario", "menu"];

const AppNavigator = () => {
  const [pantallaActual, setPantallaActual] = useState("login");
  const esCocina = pantallasCocina.includes(pantallaActual);

  const renderPantalla = () => {
    switch (pantallaActual) {
      case "login":
        return <LoginScreen cambiarPantalla={setPantallaActual} />;
      case "dashboardCocina":
        return <DashboardCocina />;
      case "pedidos":
        return <Pedidos />;
      case "inventario":
        return <Inventario/>
      case "menu":
        return (
          <View style={styles.container}>
            <Text>Menú</Text>
          </View>
        );
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

  return (
    <View style={styles.wrapper}>
      <View style={styles.contenido}>{renderPantalla()}</View>
      {esCocina && (
        <BottomTabCocina
          pantallaActual={pantallaActual}
          cambiarPantalla={setPantallaActual}
        />
      )}
    </View>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  contenido: { flex: 1 },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
