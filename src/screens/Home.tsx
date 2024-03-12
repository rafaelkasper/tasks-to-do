import {
  StyleSheet,
  FlatList,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import "react-native-get-random-values";
import React, { useContext, useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import ItemCard from "../components/ItemCard";
import { categories, todoList } from "../utils/data/todos";
import { SafeAreaView } from "react-native-safe-area-context";
import { v4 as uuid } from "uuid";
import { Task } from "../types/Task";
import CategoryItem from "../components/CategoryItem";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import { UserContext } from "../contexts/UserContext";

const Home = () => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [taskInput, setTaskInput] = useState("");
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTask] = useState<Task[]>([]);

  const getTasks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@tasks");
      const data = jsonValue != null ? JSON.parse(jsonValue) : null;
      setTaskList(data);
      setFilteredTask(data);
    } catch (e) {
      Toast.show("Não foi possível recuperar as tarefas", {
        duration: 5000,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: "red",
      });
    }
  };

  const storeTasks = async (value: Task[]) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@tasks", jsonValue);
    } catch (e) {
      Toast.show("Não foi possível salvar as tarefas", {
        duration: 5000,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: "red",
      });
    }
  };

  const getData = async () => {
    await getTasks();
  };

  const handleAddTask = async () => {
    if (taskInput !== "" && categoryValue) {
      const data = {
        id: uuid(),
        title: taskInput,
        completed: false,
        category: categoryValue,
      };
      const clone = [...taskList];
      clone.unshift(data);
      await storeTasks(clone);
      await getData();
      setTaskInput("");
      setCategoryValue(null);
    }
  };

  const handleRemoveTask = (id: string) => {
    const filter = taskList.filter((t) => t.id !== id);
    storeTasks(filter);
    getData();
  };

  const handleDoneTask = (id: string) => {
    const clone = [...taskList];
    const index = clone.findIndex((t) => t.id === id);
    clone[index].completed = true;
    storeTasks(clone);
    getData();
  };

  const handleSelectCategory = (type: string) => {
    setSelectedCategory(type);
    switch (type) {
      case "all":
        const all = taskList.filter((t) => t.completed === false);
        setFilteredTask(all);
        break;
      case "done":
        const done = taskList.filter((t) => t.completed === true);
        setFilteredTask(done);
        break;
      default:
        const filtered = taskList.filter(
          (t) => t.category === type && t.completed === false
        );
        setFilteredTask(filtered);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Olá, {user?.username} 😀</Text>
      <TextInput
        style={styles.input}
        value={taskInput}
        onChangeText={setTaskInput}
        placeholder="Crie uma nova tarefa"
        placeholderTextColor="#ccc"
      />
      <View style={styles.row}>
        <DropDownPicker
          style={styles.dropdown}
          open={open}
          value={categoryValue}
          items={categories.filter(
            (c) => c.value !== "all" && c.value !== "done"
          )}
          setOpen={setOpen}
          setValue={setCategoryValue}
          placeholder="Escolha uma categoria"
          theme="DARK"
          placeholderStyle={{
            color: "#ccc",
            fontSize: 16,
          }}
          listItemLabelStyle={{
            color: "#fff",
            fontSize: 16,
            paddingLeft: 15,
          }}
          dropDownContainerStyle={{
            backgroundColor: "#11212D",
          }}
          selectedItemContainerStyle={{
            backgroundColor: "#1c2541",
          }}
          selectedItemLabelStyle={{
            fontWeight: "bold",
            fontSize: 16,
            color: "#fff",
          }}
        />
        <MaterialIcons
          style={styles.icon}
          name="send"
          size={30}
          color="#fff"
          onPress={handleAddTask}
        />
      </View>

      <FlatList
        style={{ marginBottom: 30 }}
        data={categories}
        renderItem={({ item }) => (
          <CategoryItem
            item={item}
            handleSelectCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
      {filteredTasks.length > 0 ? (
        <FlatList
          style={{ width: "100%" }}
          data={filteredTasks}
          renderItem={({ item }) => (
            <ItemCard
              task={item}
              handleRemoveTask={handleRemoveTask}
              handleDoneTask={handleDoneTask}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 20 }}>
            Ufa, não há tarefas!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#11212D",
    paddingHorizontal: 16,
    paddingVertical: 4,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#fff",
  },
  dropdown: {
    width: "90%",
    marginLeft: 25,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#11212D",
  },
  icon: {
    marginRight: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 10,
  },
});
