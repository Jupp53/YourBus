import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, FlatList, View } from "react-native";
import { Button } from "@rneui/themed";
import SearchBarComponent from "./Search";
import IconButton from "./UI/IconButton";
import SeparatorComponent from "./UI/SeparatorComponent";
import ItemView from "./ItemView";

import {
  setOrigin,
  setDestionation,
  selectDestination,
  selectOrigin,
  resetDestionation,
  resetOrigin,
} from "../store/navSlice";

function Header({ onPressSearch, onPressStop, visableFlatList, data }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);

  const [selectedSearchBar, setSelectedSearchBar] = useState("");
  const [filteredDataOrigin, setFilteredDataOrigin] = useState([]);
  const [filteredDataDestination, setFilteredDataDestination] = useState([]);
  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDestination, setSearchDestination] = useState("");

  const handleButtonPress = () => {
    navigation.navigate("TimetableScreen");
  };

  const handleBusStopPress = (item) => {
    onPressStop();

    if (selectedSearchBar === "origin") {
      setSearchOrigin(item.name);
      dispatch(
        setOrigin({
          location: { latitude: item.latitude, longitude: item.longitude },
          details: { id: item.id, name: item.name },
        })
      );
    } else {
      setSearchDestination(item.name);
      dispatch(
        setDestionation({
          location: { latitude: item.latitude, longitude: item.longitude },
          details: { id: item.id, name: item.name },
        })
      );
    }
  };

  const handlerOnPressCancel = () => {
    onPressStop();
    if (selectedSearchBar === "origin") dispatch(resetOrigin());
    else dispatch(resetDestionation());
  };

  return (
    <View style={styles.container}>
      <SearchBarComponent
        search={searchOrigin}
        setSearch={setSearchOrigin}
        placeholder="Znajdz przystanek początkowy..."
        data={data}
        setFilteredDataSource={setFilteredDataOrigin}
        handlerOnPressCancel={handlerOnPressCancel}
        onPressSearch={() => {
          onPressSearch();
          setSelectedSearchBar("origin");
        }}
      />
      <SearchBarComponent
        search={searchDestination}
        setSearch={setSearchDestination}
        placeholder="Znajdz przystanek końcowy..."
        data={data}
        setFilteredDataSource={setFilteredDataDestination}
        handlerOnPressCancel={handlerOnPressCancel}
        onPressSearch={() => {
          onPressSearch();
          setSelectedSearchBar("destination");
        }}
      />
      {!visableFlatList && (
        <Button
          title="SZUKAJ"
          icon={{
            name: "arrow-right",
            type: "font-awesome",
            size: 15,
            color: "white",
          }}
          iconRight
          iconContainerStyle={{ marginLeft: 10 }}
          titleStyle={{ fontWeight: "700" }}
          buttonStyle={styles.button}
          containerStyle={{
            width: 150,
            alignSelf: "center",
            marginVertical: 10,
          }}
          disabled={!origin || !destination}
          disabledStyle={{ backgroundColor: "#E1E6E1" }}
          onPress={() => {
            if (
              searchOrigin.trim().toLowerCase() ===
              searchDestination.trim().toLowerCase()
            ) {
              alert("Przystanki są takie same!");
            } else {
              handleButtonPress();
            }
          }}
        />
      )}
      {visableFlatList && (
        <View>
          <FlatList
            data={
              selectedSearchBar === "origin"
                ? filteredDataOrigin
                : filteredDataDestination
            }
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <SeparatorComponent />}
            renderItem={({ item }) => (
              <ItemView
                item={item}
                onPressBusStop={() => handleBusStopPress(item)}
              />
            )}
          />
          <View
            style={{
              position: "absolute",
              width: 40,
              height: 40,
              top: 40,
              right: 20,
            }}
          >
            <IconButton
              icon={"arrow-up"}
              size={40}
              color={"#265437"}
              onPress={onPressStop}
            ></IconButton>
          </View>
        </View>
      )}
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFA",
  },
  button: {
    backgroundColor: "#53B175",
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 30,
  },
});
