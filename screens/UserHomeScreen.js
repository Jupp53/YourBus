import React, { useState, useCallback } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Keyboard } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import Map from "../components/Map/Map";
import HeaderText from "../components/UI/HeaderText";

import { BUSSTOPS } from "../data/bus-stops";

import { useUser } from "../providers/AuthenticatedUserProvider";

export const UserHomeScreen = () => {
  const { user } = useUser();
  const [headerHeight, setHeaderHeight] = useState("35%");
  const [showFlatList, setShowFlatList] = useState(false);
  const [isScreenFocused, setIsScreenFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);
      return () => {
        setIsScreenFocused(false);
      };
    }, [])
  );

  const handleSearchBarPress = () => {
    setHeaderHeight("100%");
    setShowFlatList(true);
  };

  const handleStopPress = () => {
    setHeaderHeight("35%");
    setShowFlatList(false);
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={{ ...styles.header, height: headerHeight }}>
        <HeaderText title="YourWayBus" color="#53B175" />
        <Header
          onPressSearch={handleSearchBarPress}
          onPressStop={handleStopPress}
          visableFlatList={showFlatList}
          data={BUSSTOPS}
        />
      </View>
      {
        <Map
          visableMap={showFlatList}
          userUid={user.uid}
          userRole={user.role}
          isScreenFocused={isScreenFocused}
        />
      }
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: "35%",
  },
});
