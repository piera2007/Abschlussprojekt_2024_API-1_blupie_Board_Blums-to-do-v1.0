/** 
  Author: Piera Blum
  Date: 26.06.2024
  Description: Navigation for screen navigation.
*/

import { StyleSheet, Text, View } from "react-native";
import Login from "./src/screens/Login";
import Signup from "./src/screens/Signup";
import Welcome from "./src/screens/Welcome";
import TodoList from "./src/screens/TodoList";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Homepage from "./src/screens/Homepage";
import Verification from "./src/screens/Verification";
import Weather from "./src/screens/Weather";
import Calendar from "./src/screens/Calendar";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="welcome"
          component={Welcome}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="signup"
          component={Signup}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="homepage"
          component={Homepage}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="verification"
          component={Verification}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TodoList"
          component={TodoList}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Weather"
          component={Weather}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Calendar"
          component={Calendar}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
