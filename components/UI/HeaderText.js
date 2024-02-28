import { StyleSheet, View, Text } from "react-native";

function HeaderText({ title, color }) {
  return (
    <View style={styles.headerComponent}>
      <Text style={[{ color: color }, styles.headerText]}>{title}</Text>
    </View>
  );
}

export default HeaderText;

const styles = StyleSheet.create({
  headerComponent: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFFEFA",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 30,
  },
});
