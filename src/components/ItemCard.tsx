import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { Task } from "../types/Task";
import { categories } from "../utils/data/todos";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

interface Props {
  task: Task;
  handleRemoveTask: (id: number) => void;
  handleDoneTask: (id: number) => void;
}

const ItemCard = ({ task, handleRemoveTask, handleDoneTask }: Props) => {
  const navigation = useNavigation<any>();
  const category = categories.filter((c) => c.value === task.category);

  const handleDetails = () => {
    navigation.navigate("TaskDetails", task);
  };

  const handleDelete = () => {
    Alert.alert("Tarefas", "Tem certeza que deseja excluir esta tarefa?", [
      {
        text: "Nãooooooo",
        style: "cancel",
      },
      { text: "Simmmm", onPress: () => handleRemoveTask(task.id) },
    ]);
  };

  const LeftAction = () => {
    return (
      <View style={styles.swipeLeft}>
        <MaterialIcons
          name="done"
          size={20}
          color="#fff"
          onPress={() => handleDoneTask(task.id)}
        />
      </View>
    );
  };

  const RightAction = () => {
    return (
      <View style={styles.swipeRight}>
        <MaterialIcons
          name="delete"
          size={20}
          color="#fff"
          onPress={handleDelete}
        />
      </View>
    );
  };

  return (
    <Swipeable renderLeftActions={LeftAction} renderRightActions={RightAction}>
      <TouchableOpacity onPress={handleDetails}>
        <View style={styles.container}>
          <View
            style={{
              borderStyle: "solid",
              height: "100%",
              borderLeftWidth: 6,
              borderColor: category[0].color,
              marginRight: 10,
            }}
          />
          <Text style={styles.title}>{task.title} </Text>
          <Text style={styles.date}>
            {moment(task.date).format("DD/MM/YY")}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
    padding: 10,
    backgroundColor: "#1c2541",
  },
  swipeLeft: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    borderRadius: 5,
    marginVertical: 10,
    width: 10,
    paddingLeft: 20,
    backgroundColor: "#006400",
  },
  swipeRight: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    borderRadius: 5,
    marginVertical: 10,
    width: 10,
    paddingRight: 20,
    backgroundColor: "#ff0035",
  },
  title: {
    color: "#fff",
    fontSize: 20,
  },
  date: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ItemCard;
