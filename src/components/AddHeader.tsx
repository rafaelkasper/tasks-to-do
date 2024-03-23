import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const AddHeader = () => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity onPress={() => navigation.navigate("AddTask")}>
      <MaterialIcons name="add" size={40} color="#fff" />
    </TouchableOpacity>
  );
};

export default AddHeader;
