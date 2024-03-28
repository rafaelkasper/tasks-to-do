import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import Home from "../screens/Home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import User from "../screens/User";
import AddTask from "../screens/AddTask";
import AddHeader from "../components/AddHeader";
import TaskDetails from "../screens/TaskDetails";

const Stack = createNativeStackNavigator();

export const HomeRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Todo"
        component={Home}
        options={{
          headerTitle: "Tasks To do",
          headerStyle: {
            backgroundColor: "#11212D",
          },
          headerTintColor: "#fff",
          headerRight: () => <AddHeader />,
        }}
      />
      <Stack.Screen
        name="AddTask"
        component={AddTask}
        options={{
          headerTitle: "Adicionar Tarefa",
          headerStyle: {
            backgroundColor: "#11212D",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetails}
        options={{
          headerTitle: "Detalhes da Tarefa",
          headerStyle: {
            backgroundColor: "#11212D",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

export const AppRoutes = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarInactiveBackgroundColor: "#11212D",
        tabBarActiveBackgroundColor: "#11212D",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeRoutes}
        options={{
          tabBarIcon: () => (
            <MaterialIcons name="home" size={30} color="#8da9c4" />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={User}
        options={{
          tabBarIcon: () => (
            <MaterialIcons name="person" size={30} color="#8da9c4" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
