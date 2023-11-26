import React, { useState } from "react";
import { StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api";

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const body = {
      name: name,
      email: email,
      password: password,
    };
    try {
      const response = await api.register(body);

      if (response.success || response?.data?.success) {
        // AsyncStorage.setItem("userData", JSON.stringify(response.data));
        setTimeout(() => {
          navigation.goBack();
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

      <Title style={styles.title}>Sign Up</Title>
      <TextInput
        label="Full Name"
        value={name}
        onChangeText={(text) => setName(text)}
        style={styles.input}
        mode="outlined"
      />
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
      <Button mode="contained" onPress={handleSignup} style={styles.button}>
        Sign Up
      </Button>
      <Button
        onPress={() => navigation.navigate("Login")}
        style={styles.loginButton}
        labelStyle={{ color: "#00cc99" }}
      >
        Already have an account? Login here
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
  loginButton: {
    marginTop: 16,
  },
});

export default SignupScreen;
