/** 
  Author: Piera Blum
  Date: 26.06.2024
  Description: This is the Homepage.
*/

import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React from "react";
import { button1 } from "../common/button";
import logo from "../../assets/mainlogo.png";
import backgroundImage from "../../assets/pattern.png";

const Homepage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={backgroundImage} style={styles.backgroundImage} />
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/Bild1.png")}
            style={styles.image}
          />
          <Image
            source={require("../../assets/Bild2.png")}
            style={styles.image}
          />
          <Image
            source={require("../../assets/Bild3.png")}
            style={styles.image}
          />
          <Image
            source={require("../../assets/Bild4.png")}
            style={styles.image}
          />
          <Image
            source={require("../../assets/Bild5.png")}
            style={styles.image}
          />
          <Image
            source={require("../../assets/Bild6.png")}
            style={styles.image}
          />
        </View>

        <Text
          style={[button1, styles.logoutButton]}
          onPress={() => navigation.navigate("login")}
        >
          Logout
        </Text>
        <View style={styles.buttonContainer}>
          <Text
            style={[button1, styles.button]}
            onPress={() => navigation.navigate("TodoList")}
          >
            Go to To-Do List
          </Text>
          <Text
            style={[button1, styles.button]}
            onPress={() => navigation.navigate("Weather")}
          >
            Go to Weather app
          </Text>
          <Text
            style={[button1, styles.button]}
            onPress={() => navigation.navigate("Calendar")}
          >
            Go to Calendar app
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Homepage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: "center", 
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 300, 
    height: 150, 
    resizeMode: "contain",
    borderRadius: 20, 
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around", 
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginVertical: 10,
    resizeMode: "contain",
    borderRadius: 20, 
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    flexWrap: "wrap", 
  },
  button: {
    width: "30%", 
    marginBottom: 10,
    textAlign: "center",
  },
  logoutButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1, 
  },
});
