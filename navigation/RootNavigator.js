import React, { useState, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { AuthStack } from "./AuthStack";
import { AppStack } from "./AppStack";
import { DriverStack } from "./DriverStack";
import { LoadingOverlay } from "../components/UI/LoadingOverlay";

import { AuthenticatedUserContext } from "../providers/AuthenticatedUserProvider";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserRole, getUserName } from "../utils/firebaseUtils";

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        try {
          if (authenticatedUser) {
            const [role, displayName] = await Promise.all([
              getUserRole(authenticatedUser.uid),
              getUserName(authenticatedUser.uid),
            ]);
            authenticatedUser.role = role;
            authenticatedUser.displayName = displayName;
            setUser(authenticatedUser);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
      }
    );
    return unsubscribeAuthStateChanged;
  }, [user]);

  return (
    <NavigationContainer>
      {isLoading ? (
        <LoadingOverlay />
      ) : user ? (
        user.role === "user" ? (
          <AppStack />
        ) : user.role === "driver" ? (
          <DriverStack />
        ) : (
          <AuthStack />
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};
