import { Provider } from "react-redux";
import { store } from "../store/store";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { Ionicons } from "@expo/vector-icons";
import { UserHomeScreen } from "../screens/UserHomeScreen";
import { TimetableScreen } from "../screens/TimetableScreen";
import { SelectedJourneysScreen } from "../screens/SelectedJourneysScreen";
import { MapScreen } from "../screens/MapScreen";
import { BusLinesScreen } from "../screens/scheduleScreens/BusLinesScreen";
import { BusStopsScreen } from "../screens/scheduleScreens/BusStopsScreen";
import { StopTimeTable } from "../screens/scheduleScreens/StopTimeTable";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          const size = 20;
          if (route.name === "BusLine") {
            iconName = focused ? "bus" : "bus-outline";
          } else if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "SelectedJourneys") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={"#265437"} />;
        },
        tabBarIndicatorStyle: { backgroundColor: "#265437" },
        tabBarLabel: () => null,
      })}
    >
      <Tab.Screen name="BusLine" component={BusLinesScreen} />
      <Tab.Screen name="Home" component={UserHomeScreen} />
      <Tab.Screen name="SelectedJourneys" component={SelectedJourneysScreen} />
    </Tab.Navigator>
  );
};

export const AppStack = () => {
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
          name="TimetableScreen"
          component={TimetableScreen}
          options={{ title: "Wyszukane połączenia:" }}
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
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{ title: "Godziny odjazdów:" }}
        />
      </Stack.Navigator>
    </Provider>
  );
};
