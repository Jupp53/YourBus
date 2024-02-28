import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function IconButton({ icon, size, color, onPress, displayStatus }) {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          width: size + 10,
          height: size + 10,
          borderRadius: size / 2,
        },
        styles.buttonContainer,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={displayStatus}
    >
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.7,
  },
});
