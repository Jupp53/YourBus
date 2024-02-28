import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderText from "../../components/UI/HeaderText";
import { BUSLINES } from "../../data/bus-lines";

export const BusLinesScreen = () => {
  const navigation = useNavigation();

  const handleLinePress = (line) => {
    navigation.navigate("BusStops", { lineId: line.id });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.lineItem}
      onPress={() => handleLinePress(item)}
    >
      <Text style={styles.lineText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderText title="Linie Autobusowe" color="#265437" />

      <FlatList
        data={BUSLINES}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#FFFEFA",
  },
  lineItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 12,
  },
  lineText: {
    fontSize: 18,
    color: "#333",
  },
});
