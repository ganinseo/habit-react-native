import React from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "../../AppNavigator";

const MainScreen = () => {
  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
};

export default MainScreen;