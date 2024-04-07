import "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { UserContextProvider } from "./src/contexts/UserContext";
import { Routes } from "./src/routes";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TaskContextProvider } from "./src/contexts/TaskContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useEffect } from "react";

export default function App() {
  const configGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        "903619143953-hsgqi1l215r9thrm2nutnbmtg6imok8o.apps.googleusercontent.com",
      profileImageSize: 120,
    });
  };
  useEffect(() => {
    configGoogleSignIn();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <UserContextProvider>
          <TaskContextProvider>
            <Routes />
          </TaskContextProvider>
        </UserContextProvider>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
}
