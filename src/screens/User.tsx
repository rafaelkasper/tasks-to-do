import { StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../contexts/UserContext";

const User = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        {user?.firstName.toUpperCase()} {user?.lastName.toUpperCase()}
      </Text>
      <Image
        resizeMode="contain"
        style={styles.thumb}
        source={{
          uri: user?.image,
        }}
      />
      <Text style={styles.description}>{user?.username}</Text>
      <Text style={styles.description}>{user?.email}</Text>

      <TouchableOpacity style={styles.button} onPress={() => logout()}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#11212D",
  },
  thumb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#003d5b",
    marginVertical: 10,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  description: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 10,
  },
  button: {
    width: "90%",
    height: 50,
    backgroundColor: "#003d5b",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
  },
});
