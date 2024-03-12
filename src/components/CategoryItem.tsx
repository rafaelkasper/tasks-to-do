import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { FC } from "react";
import { Category } from "../types/Task";

interface Props {
  item: Category;
  handleSelectCategory: (type: string) => void;
  selectedCategory: string;
}

const CategoryItem: FC<Props> = ({
  item,
  handleSelectCategory,
  selectedCategory,
}) => {
  return (
    <TouchableOpacity onPress={() => handleSelectCategory(item.value)}>
      <Text
        style={{
          backgroundColor: item.color,
          color: "#fff",
          fontSize: 16,
          marginTop: 8,
          marginBottom: 25,
          marginHorizontal: 10,
          paddingHorizontal: 25,
          paddingVertical: 10,
          borderRadius: 10,
          height: 40,
          fontWeight: "bold",
          borderWidth: 2,
          borderColor: item.value === selectedCategory ? "#fff" : item.color,
        }}
      >
        {item.label.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryItem;
