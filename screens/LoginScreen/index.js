import React, { useState } from "react";
import { StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api";

const LoginScreen = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const body = {
      email: email,
      password: password,
    };
    try {
      const response = await api.login(body);

      if (response.success || response?.data?.success) {
        AsyncStorage.setItem("userData", JSON.stringify(response.data));
        setTimeout(() => {
          navigation.replace("Home");
        }, 2000);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log("error1");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar animated={true} backgroundColor="#00cc99" />

      <Title style={styles.title}>Login</Title>
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Button
        onPress={() => navigation.navigate("Signup")}
        style={styles.signupButton}
        labelStyle={{ color: "#00cc99" }}
      >
        Don't have an account? Sign up here
      </Button>
      <Button
        onPress={() => navigation.navigate("ForgotPassword")}
        labelStyle={{ color: "#00cc99" }}
      >
        Forgot your password?
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#00cc99",
  },
  signupButton: {
    marginTop: 16,
  },
});

export default LoginScreen;
