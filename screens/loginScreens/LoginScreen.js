import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LoadingOverlay } from "../../components/UI/LoadingOverlay";
import HeaderText from "../../components/UI/HeaderText";

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  const onHandleLogin = () => {
    if (email !== "" && password !== "") {
      setIsLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log("Login success");
          setIsLoading(false);
        })
        .catch((err) => {
          Alert.alert("Błąd logowania: ", err.message);
          setIsLoading(false);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Ionicons name={"bus"} size={40} color={"black"} />
        <HeaderText title="YourWayBus" color="#53B175" />
      </View>
      <Text style={styles.title}>Logowanie</Text>
      <TextInput
        style={styles.input}
        placeholder="Podaj email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoFocus={true}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Podaj hasło"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        textContentType="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
        <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
          Zaloguj
        </Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Nie masz jeszcze konta? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("RegistrationScreen")}
        >
          <Text style={styles.signupLink}>Zarejestruj się</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFEFA",
  },
  logo: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "70%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
  },
  button: {
    backgroundColor: "#53B175",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  signupContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  signupText: {
    color: "gray",
    fontWeight: "600",
    fontSize: 14,
  },
  signupLink: {
    color: "#265437",
    fontWeight: "600",
    fontSize: 14,
  },
});
