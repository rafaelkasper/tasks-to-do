import { StyleSheet, TextInput, View, Text } from "react-native";
import "react-native-get-random-values";
import React, { useContext, useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import ItemCard from "../components/ItemCard";
import { categories } from "../utils/data/todos";
import { SafeAreaView } from "react-native-safe-area-context";
import { Task } from "../types/Task";
import CategoryItem from "../components/CategoryItem";
import DropDownPicker from "react-native-dropdown-picker";
import Animated, {
  BounceInDown,
  FlipInYRight,
  FlipOutYRight,
} from "react-native-reanimated";
import { UserContext } from "../contexts/UserContext";
import * as SQLite from "expo-sqlite";

const Home = () => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [taskInput, setTaskInput] = useState("");
  const [taskList, setTaskList] = useState<Task[]>([]);

  const openDatabase = () => {
    const db = SQLite.openDatabase("db.db");
    return db;
  };

  const db = openDatabase();

  const getTasks = async () => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from tasks where completed = 0;`,
        [],
        (_, { rows: { _array } }) => {
          setTaskList(_array);
        }
      );
    });
  };

  const getTasksByCategory = (category: string) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from tasks where completed = 0 and category = ?;`,
        [category],
        (_, { rows: { _array } }) => {
          setTaskList(_array);
        }
      );
    });
  };

  const getCompletedTasks = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from tasks where completed = 1;`,
        [],
        (_, { rows: { _array } }) => {
          setTaskList(_array);
        }
      );
    });
  };

  const handleAddTask = async () => {
    if (taskInput !== "" && categoryValue) {
      db.transaction((tx) => {
        tx.executeSql(
          "insert into tasks (completed, title, category) values (0, ?, ?)",
          [taskInput, categoryValue]
        );
        tx.executeSql(
          `select * from tasks where completed = 0;`,
          [],
          (_, { rows: { _array } }) => {
            setTaskList(_array);
          }
        );
      });
    }

    setTaskInput("");
    setCategoryValue(null);
  };

  const handleRemoveTask = (id: number) => {
    db.transaction((tx) => {
      tx.executeSql("delete from tasks where id = ?", [id]);
      tx.executeSql(
        `select * from tasks where completed = 0;`,
        [],
        (_, { rows: { _array } }) => {
          setTaskList(_array);
        }
      );
    });
  };

  const handleDoneTask = (id: number) => {
    db.transaction((tx) => {
      tx.executeSql("update tasks set completed = ? where id = ? ", [1, id]);
      tx.executeSql(
        `select * from tasks where completed = 0;`,
        [],
        (_, { rows: { _array } }) => {
          setTaskList(_array);
        }
      );
    });
  };

  const handleSelectCategory = (type: string) => {
    setSelectedCategory(type);
    switch (type) {
      case "all":
        getTasks();
        break;
      case "done":
        getCompletedTasks();
        break;
      default:
        getTasksByCategory(type);
    }
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists tasks (id integer primary key not null, completed int, title text, category text);"
      );
    });
    getTasks();
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

      <Animated.FlatList
        entering={BounceInDown}
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
      {taskList && taskList.length > 0 ? (
        <Animated.FlatList
          entering={FlipInYRight}
          exiting={FlipOutYRight}
          style={{ width: "100%" }}
          data={taskList}
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
        <Animated.View
          entering={BounceInDown}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 20 }}>
            {selectedCategory === "done"
              ? "Eita, nenhuma tarefa concluída! 😢"
              : "Ufa, não há tarefas! 😋"}
          </Text>
        </Animated.View>
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
