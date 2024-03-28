import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  Image,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Task } from "../types/Task";
import moment from "moment";
import { TaskContext } from "../contexts/TaskContext";

const TaskDetails = () => {
  const routes = useRoute<any>();
  const { takePhoto, pickImage, getTasksById, taskSelected } =
    useContext(TaskContext);
  const { title, date, id, images } = routes.params as Task;

  const width = Dimensions.get("window").width;

  const styles = StyleSheet.create({
    item: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10,
      padding: 15,
    },
    title: {
      color: "#fff",
      fontSize: 24,
    },
    date: {
      color: "#fff",
      fontSize: 20,
    },
    image: {
      width: width,
      aspectRatio: 1.77,
      marginVertical: 5,
      resizeMode: "contain",
    },
    info: {
      width: "100%",
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#1c2541",
      marginBottom: 15,
      shadowColor: "#fff",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      elevation: 10,
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#11212D" }}>
      <View style={styles.item}>
        <View style={styles.info}>
          <Text style={styles.title}>{title} </Text>
          <Text style={styles.date}>{moment(date).format("DD/MM/YY")}</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <MaterialIcons
            name="add-a-photo"
            size={40}
            color="#fff"
            onPress={() => takePhoto(id)}
            style={{ marginRight: 20 }}
          />
          <MaterialIcons
            name="add-photo-alternate"
            size={40}
            color="#fff"
            onPress={() => pickImage(id)}
          />
        </View>
        {images && (
          <FlatList
            style={{ marginBottom: 30 }}
            data={images.split(",")}
            renderItem={({ item }) => (
              <Image
                source={{ uri: "data:image/jpeg;base64," + item }}
                style={styles.image}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default TaskDetails;
