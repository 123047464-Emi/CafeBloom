import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import theme from "../../theme";


//Definimos los componentes 
export default function TarjetaNavegacion({
    //Estos props personalizan cada tarjeta
    titulo,
    descripcion,
    textoBoton,
    pantalla,
}){
    //Logica de la navegacion simulada
    const manejarNavegacion=()=>{
        Alert.alert(
            "Navegación",
            `Ir a ${pantalla}`
        );
    };
    return(
        <View style={styles.card}>
            <Text style={styles.titulo}>
                {titulo}
            </Text>
            <Pressable style={styles.boton}onPress={manejarNavegacion}>
                <Text style={styles.textoBoton}>{textoBoton}</Text>
                </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
});