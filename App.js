import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddExpenseScreen from "./screens/AddExpenseScreen";
import EditExpenseScreen from "./screens/EditExpenseScreen";
import { PaperProvider } from "react-native-paper";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userData");
      if (userToken) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? "Home" : "Login"}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Add" component={AddExpenseScreen} />
          <Stack.Screen name="Edit" component={EditExpenseScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
