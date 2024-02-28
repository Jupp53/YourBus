import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { resetJourneys } from "../../store/journeySlice";
import { resetDestionation, resetOrigin } from "../../store/navSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(resetDestionation());
        dispatch(resetOrigin());
        dispatch(resetJourneys());
      })
      .catch((error) => console.log("Error logging out: ", error));
  };
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handleLogout}
    >
      <Text style={styles.text}>Wyloguj</Text>
      <Ionicons name="log-out" size={40} color="#265437" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 8,
    paddingRight: 5,
  },
  pressed: {
    opacity: 0.5,
  },
});

export default LogoutButton;
