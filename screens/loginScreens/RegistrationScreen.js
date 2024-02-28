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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "../../config/firebase";
import HeaderText from "../../components/UI/HeaderText";

export const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const userRef = ref(database, `users/${user.uid}`);
      set(userRef, {
        displayName: name,
        email: email,
        role: "user",
      });
    } catch (error) {
      Alert.alert("Błąd rejestracji: ", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Ionicons name={"bus"} size={40} color={"black"} />
        <HeaderText title="YourWayBus" color="#53B175" />
      </View>
      <Text style={styles.title}>Rejestracja</Text>
      <TextInput
        style={styles.input}
        placeholder="Podaj nazwę użytkownika"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Podaj email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoFocus={false}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Podaj hasło"
        autoCapitalize="none"
        autoCorrect={false}
        showSoftInputOnFocus={false}
        secureTextEntry={true}
        textContentType="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
        <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
          Zarejestruj
        </Text>
      </TouchableOpacity>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Masz już konto? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.loginLink}>Zaloguj się</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFA",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    margin: 20,
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
  loginContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    color: "gray",
    fontWeight: "600",
    fontSize: 14,
  },
  loginLink: {
    color: "#265437",
    fontWeight: "600",
    fontSize: 14,
  },
});
