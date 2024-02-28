import React from "react";
import { AuthenticatedUserProvider } from "./providers/AuthenticatedUserProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./navigation/RootNavigator";
import { StatusBar } from "react-native";

const App = () => {
  return (
    <AuthenticatedUserProvider>
      <SafeAreaProvider>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <RootNavigator />
      </SafeAreaProvider>
    </AuthenticatedUserProvider>
  );
};

export default App;
