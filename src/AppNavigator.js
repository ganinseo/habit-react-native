import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import CalendarScreen from "./components/screens/CalendarScreen";
import TodayHabitScreen from "./components/screens/TodayHabitScreen";
import FriendsScreen from "./components/screens/FriendsScreen";
import AddHabitScreen from "./components/screens/AddHabitScreen";
import EditHabitScreen from "./components/screens/EditHabitScreen";
import MyPageScreen from "./components/screens/MyPageScreen";
import FriendHabitsScreen from "./components/screens/FriendHabitsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// TodayHabitStack 정의
const TodayHabitStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="TodayHabitScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TodayHabitScreen" component={TodayHabitScreen} />
      <Stack.Screen name="AddHabit" component={AddHabitScreen} />
      <Stack.Screen name="EditHabit" component={EditHabitScreen} />
    </Stack.Navigator>
  );
};

// FriendsStack 정의
const FriendsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="FriendsScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FriendsScreen" component={FriendsScreen} />
      <Stack.Screen name="MyPageScreen" component={MyPageScreen} />
      <Stack.Screen
        name="FriendHabitsScreen" // 추가
        component={FriendHabitsScreen}
      />
    </Stack.Navigator>
  );
};

// AppNavigator 정의
const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="TodayHabitStack"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Calendar") {
            iconName = "calendar";
          } else if (route.name === "TodayHabitStack") {
            iconName = "home";
          } else if (route.name === "FriendsStack") {
            iconName = "people";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#ABB2FF",
        tabBarInactiveTintColor: "#C5C4C4",
        tabBarStyle: {
          backgroundColor: "#F2F4FC",
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: "" }} />
      <Tab.Screen name="TodayHabitStack" component={TodayHabitStack} options={{ title: "" }} />
      <Tab.Screen name="FriendsStack" component={FriendsStack} options={{ title: "" }} />
    </Tab.Navigator>
  );
};

export default AppNavigator;