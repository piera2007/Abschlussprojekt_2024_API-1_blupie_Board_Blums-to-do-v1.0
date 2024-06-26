/** 
  Author: Piera Blum
  Date: 26.06.2024
  Description: This is the Frontend for the Verification Page.
*/

import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import pattern from "../../assets/pattern.png";
import logo from "../../assets/mainlogo.png";
import { button1 } from "../common/button";
import {
  bwmessage,
  errormessage,
  formgroup,
  head1,
  input,
  label,
  link,
  link2,
} from "../common/formcss";

const Verification = ({ navigation, route }) => {
  const { userdata } = route.params;

  const [errormsg, setErrormsg] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [actualCode, setActualCode] = useState(null);

  useEffect(() => {
    setActualCode(userdata.verificationCode);
  }, [userdata]);

  const Sendtobackend = () => {
    if (userCode === "" || userCode.length !== 4) {
      setErrormsg("Please enter the correct verification code");
      return;
    } else if (userCode === actualCode) {
      const fdata = {
        email: userdata.email,
        password: userdata.password,
        name: userdata.name,
        address: userdata.address,
        dob: userdata.dob,
      };

      fetch("http://10.80.4.173:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fdata),
      })
        .then((res) => {
          console.log("Raw response: ", res);
          return res.json();
        })
        .then((data) => {
          console.log("Parsed response: ", data);
          if (data.message === "User Registered Successfully") {
            alert(data.message);
            navigation.navigate("login");
          } else {
            alert("Something went wrong !! Try Signing Up Again");
          }
        })
        .catch((error) => {
          console.error("Error during fetch:", error);
          setErrormsg("Network request failed");
        });
    } else {
      setErrormsg("Incorrect code");
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.patternbg} source={pattern} />

      <View style={styles.container1}>
        <View style={styles.s1}>
          <Image style={styles.logo} source={logo} />
          <Text
            style={styles.h1}
            onPress={() => navigation.navigate("welcome")}
          >
            Used2, Inc.
          </Text>
          <Text style={styles.small1}>Buying and selling online</Text>
        </View>
        <View style={styles.s2}>
          <Text style={head1}>Verification</Text>
          <Text style={bwmessage}>
            A 4-digit Verification Code has been generated for you
          </Text>
          {actualCode && (
            <Text style={bwmessage}>
              Your Verification Code is: {actualCode}
            </Text>
          )}
          {errormsg ? <Text style={errormessage}>{errormsg}</Text> : null}

          <View style={formgroup}>
            <Text style={label}>Verification Code</Text>
            <TextInput
              style={input}
              placeholder="Enter 4 digit Verification Code"
              onChangeText={(text) => setUserCode(text)}
              onPressIn={() => setErrormsg(null)}
            />
          </View>
          <Text style={button1} onPress={() => Sendtobackend()}>
            Verify
          </Text>
          <Text style={link2}>
            Don't have an account?&nbsp;
            <Text style={link} onPress={() => navigation.navigate("signup")}>
              Create a new account
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Verification;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
  },
  patternbg: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  container1: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  s1: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "40%",
  },
  small1: {
    color: "#fff",
    fontSize: 17,
  },
  h1: {
    fontSize: 30,
    color: "#fff",
  },
  s2: {
    display: "flex",
    backgroundColor: "#fff",
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  formgroup: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginVertical: 10,
  },
  label: {
    fontSize: 17,
    color: "#000",
    marginLeft: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FFB0CC",
    borderRadius: 20,
    padding: 10,
  },
  logo: {
    height: 80,
    resizeMode: "contain",
  },
  button1: {
    backgroundColor: "#FFB0CC",
    borderRadius: 20,
    padding: 10,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    marginTop: 20,
  },
  link2: {
    color: "#FFB0CC",
    textAlign: "center",
    marginTop: 10,
  },
  link: {
    color: "#FFB0CC",
  },
  errormessage: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  bwmessage: {
    color: "#000",
    textAlign: "center",
    marginTop: 10,
  },
});
