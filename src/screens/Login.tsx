import { StyleSheet, TextInput, Text, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/Button";

const Login = () => {
  const { getToken, getUser, login, googleSignIn } = useContext(UserContext);

  const [username, setUseername] = useState("kminchelle");
  const [password, setPassword] = useState("0lelplR");

  useEffect(() => {
    getToken();
    getUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>LOGIN</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUseername}
        autoCapitalize="none"
        placeholder="Insira seu usuário"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Insira sua senha"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => login(username, password)}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Button
        onPress={() => googleSignIn()}
        title="Login com Google"
        icon="google"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#07161B",
    padding: 10,
  },
  input: {
    width: "100%",
    height: 50,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
    color: "#fff",
    borderColor: "#ccc",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#3D737F",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
  },
  buttonText: {
    color: "#fff",
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
});

export default Login;
