import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from "react-native";
import theme from "../../theme";


import TarjetaEstadistica from "../../Components/Cocina/TarjetaEstadistica";
import TarjetaNavegacion from "../../Components/Cocina/TarjetaNavegacion";


import{estadisticas, modulosDashboard,} from "../../data/datosMockCocina";


//Definimos la pantalla principal
export default function DashboardCocina(){
    return(
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}
            >
            {/*Cuerpo de la pantalla */}
            <View style={styles.encabezado}>
                <Text style={styles.title}> Cocina
                </Text>
                <Text style={styles.subtitulo}>
                    Gestión de pedidos e inventario
                </Text>
            </View>
            {/*Estadisticas*/}
            <View style={styles.seccion}>
                <Text style={styles.tituloSeccion}>
                    Resumen del dia
                </Text>
                <View style={styles.filasEstadisticas}>
                    <TarjetaEstadistica
                        titulo="Activo"
                        valor={estadisticas.activos}
                    />
                    <TarjetaEstadistica
                        titulo="Preparando"
                        valor={estadisticas.preparando}
                    />
                    <TarjetaEstadistica
                        titulo="Listos"
                        valor={estadisticas.listos}
                    />
                </View>
            </View>
            {/*Modulos */}
            <View style={styles.seccion}>
                <Text style={styles.tituloSeccion}>
                    Módulos Principales
                </Text>
                {modulosDashboard.map((modulo)=>(
                    <TarjetaNavegacion
                    key={modulo.id}
                    titulo={modulo.titulo}
                    descripcion={modulo.descripcion}
                    textoBoton={modulo.textoBoton}
                    pantalla={modulo.pantalla}
                    />
                ))}
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },

  encabezado: {
    alignItems: "center",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },

  titulo: {
    fontSize: theme.fonts.size.xxl,
    color: theme.colors.text,
    fontWeight: theme.fonts.weight.bold,
    fontFamily: "ButlerBold",
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },

  subtitulo: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },

  seccion: {
    marginBottom: theme.spacing.xl,
  },

  tituloSeccion: {
    fontSize: theme.fonts.size.lg,
    color: theme.colors.text,
    fontWeight: theme.fonts.weight.bold,
    marginBottom: theme.spacing.md,
  },

  filaEstadisticas: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
});