import { StatusBar } from 'expo-status-bar';
import React, { useState } from "react";
import { StyleSheet, View } from 'react-native';

import LoginScreen from './Screens/LoginScreen';
import DashboardCocina from './Screens/Cocina/DashboardCocina';

export default function App() {
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
            {/* aquí luego metes Mesero */}
          </View>
        );

      case "dashboardCaja":
        return (
          <View style={styles.container}>
            {/* aquí luego metes Caja */}
          </View>
        );

      default:
        return <LoginScreen cambiarPantalla={setPantallaActual} />;
    }
  };

  return (
    <>
      {renderPantalla()}
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});