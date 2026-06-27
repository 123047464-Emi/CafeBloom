import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import theme from "../theme";

// Componente reutilizable Input
const Input = ({ placeholder, value, onChangeText, secureTextEntry = false }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textLight}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  );
};

// Pantalla principal de Login
export default function LoginScreen({ cambiarPantalla }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectRol, setSelectRol] = useState("Cocina");

  // credenciales por rol 
  const credenciales = {
    Mesero: {
      email: "mesero@cafebloom.com",
      password: "mesero123",
    },
    Cocina: {
      email: "cocina@cafebloom.com",
      password: "cocina123",
    },
    Caja: {
      email: "caja@cafebloom.com",
      password: "caja123",
    },
  };

  const Login = () => {
    if (!email || !password) {
      Alert.alert(
        "Campos obligatorios",
        "Debes ingresar tu correo y contraseña"
      );
      return;
    }

    const credRol = credenciales[selectRol];

    if (
      email === credRol.email &&
      password === credRol.password
    ) {
      Alert.alert("Bienvenido", `Acceso concedido como ${selectRol}`);

      //  navegación según rol
      if (selectRol === "Cocina") {
        cambiarPantalla("dashboardCocina");
      } else if (selectRol === "Mesero") {
        cambiarPantalla("dashboardMesero");
      } else if (selectRol === "Caja") {
        cambiarPantalla("dashboardCaja");
      }

    } else {
      Alert.alert(
        "Error de autenticación",
        `Credenciales incorrectas para ${selectRol}`
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Café Bloom</Text>

      <Text style={styles.subtitle}>
        Inicia sesión para acceder al sistema
      </Text>

      <Input
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
      />

      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.subtitle}>Selecciona tu rol</Text>

      <View style={styles.roles}>
        {["Mesero", "Cocina", "Caja"].map((rol) => (
          <TouchableOpacity
            key={rol}
            style={[
              styles.roleButton,
              selectRol === rol && styles.roleSelected,
            ]}
            onPress={() => setSelectRol(rol)}
          >
            <Text style={styles.roleText}>{rol}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={Login}
      >
        <Text style={styles.buttonText}>
          Iniciar Sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: theme.fonts.size.xxl,
    color: theme.colors.text,
    fontWeight: theme.fonts.weight.bold,
    fontFamily: "ButlerBold",
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },

  subtitle: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },

  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    width: "100%",
    maxWidth: 350,
  },

  roles: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    maxWidth: 350,
    marginBottom: theme.spacing.lg,
  },

  roleButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 80,
    alignItems: "center",
  },

  roleSelected: {
    backgroundColor: theme.colors.primaryLight,
  },

  roleText: {
    color: theme.colors.text,
    fontWeight: theme.fonts.weight.medium,
  },

  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
  },

  buttonText: {
    color: "#fff",
    fontSize: theme.fonts.size.md,
    fontWeight: theme.fonts.weight.semibold,
  },
});