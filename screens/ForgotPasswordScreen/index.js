import React, { useState } from "react";
import { StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    alert(`Password reset initiated for ${email}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar animated={true} backgroundColor="#00cc99" />

      <Title style={styles.title}>Forgot Password</Title>
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        mode="outlined"
      />
      <Button
        mode="contained"
        onPress={handleResetPassword}
        style={styles.button}
      >
        Reset Password
      </Button>
      <Button
        onPress={() => navigation.goBack()}
        style={styles.goBackButton}
        labelStyle={{ color: "#00cc99" }}
      >
        Go back to Login
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
  goBackButton: {
    marginTop: 16,
  },
});

export default ForgotPasswordScreen;
