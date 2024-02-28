import { Provider } from "react-redux";
import { store } from "../store/store";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { Ionicons } from "@expo/vector-icons";
import { DriverHomeScreen } from "../screens/DriverHomeScreen";
import { DriverMapScreen } from "../screens/DriverMapScreen";
import { BusLinesScreen } from "../screens/scheduleScreens/BusLinesScreen";
import { BusStopsScreen } from "../screens/scheduleScreens/BusStopsScreen";
import { StopTimeTable } from "../screens/scheduleScreens/StopTimeTable";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="DriverHomeScreen"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          const size = 20;
          if (route.name === "BusLine") {
            iconName = focused ? "bus" : "bus-outline";
          } else if (route.name === "DriverHomeScreen") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "DriverMapScreen") {
            iconName = focused ? "map" : "map-outline";
          }
          return <Ionicons name={iconName} size={size} color={"#265437"} />;
        },
        tabBarIndicatorStyle: { backgroundColor: "#265437" },
        tabBarLabel: () => null,
      })}
    >
      <Tab.Screen name="BusLine" component={BusLinesScreen} />
      <Tab.Screen name="DriverHomeScreen" component={DriverHomeScreen} />
      <Tab.Screen name="DriverMapScreen" component={DriverMapScreen} />
    </Tab.Navigator>
  );
};

export const DriverStack = () => {
  return (
    <Provider store={store}>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 25,
            color: "#265437",
          },
        }}
      >
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BusStops"
          component={BusStopsScreen}
          options={{ title: "Wybierz przystanek:" }}
        />
        <Stack.Screen
          name="StopTimeTable"
          component={StopTimeTable}
          options={{ title: "Godziny odjazdów:" }}
        />
      </Stack.Navigator>
    </Provider>
  );
};
