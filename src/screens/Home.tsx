import { StyleSheet, Text } from "react-native";
import "react-native-get-random-values";
import React, { useContext, useEffect } from "react";
import ItemCard from "../components/ItemCard";
import { categories } from "../utils/data/todos";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryItem from "../components/CategoryItem";
import Animated, {
  BounceInDown,
  FlipInYRight,
  FlipOutYRight,
} from "react-native-reanimated";
import { UserContext } from "../contexts/UserContext";
import { TaskContext } from "../contexts/TaskContext";
import WeekCalendar from "../components/WeekCalendar";

const Home = () => {
  const { user } = useContext(UserContext);
  const {
    taskList,
    selectedCategory,
    formatedToday,
    handleSelectCategory,
    handleRemoveTask,
    handleDoneTask,
    db,
    getTasks,
  } = useContext(TaskContext);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists tasks (id integer primary key not null, completed int, title text, category text, date text, images text);"
      );
    });
    getTasks();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Olá, {user?.firstName.toUpperCase()}, hoje é dia {formatedToday}
      </Text>

      <WeekCalendar />

      <Animated.FlatList
        entering={BounceInDown}
        style={{ maxHeight: 70 }}
        data={categories}
        renderItem={({ item }) => (
          <CategoryItem
            item={item}
            handleSelectCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
          />
        )}
        keyExtractor={(item) => item.id}
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
  title: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 20,
  },
});
