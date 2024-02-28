import { StyleSheet, Pressable, Text } from "react-native";

function ItemView({ item, onPressBusStop }) {
  return (
    <Pressable
      style={({ pressed }) => [
        pressed && styles.pressed,
        { padding: 10, width: "100%" },
      ]}
      onPress={onPressBusStop}
    >
      <Text>{item.name}</Text>
    </Pressable>
  );
}

export default ItemView;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
    backgroundColor: "#3F51B5",
  },
});
