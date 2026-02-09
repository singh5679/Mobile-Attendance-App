import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../constants/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });
       console.log("Login response:", res.data);

  //    const { token , user } = res.data;
  //    await AsyncStorage.setItem("token", token);
  //    await AsyncStorage.setItem("role", user.role);

  //    // Role Based Redirect 
  //    if(user.role === "teacher"){
  //     router.replace("/teacher/home");//Teacher dashboard
  //    }else{
  //     router.replace("/(student-tabs)/home");//Student dashboard

  //    }
  //   } catch (err: any) {
  //     Alert.alert("Login Failed", err?.response?.data?.message || "Error");
  //      Alert.alert(
  //   "Login failed",
  //   err?.response?.data?.message || "Something went wrong"
  // );
  //   }
  // };
  const token = res.data.token;
    if (!token) {
      throw new Error("Token missing");
    }
    await AsyncStorage.setItem("token", token);
     
    const role = res.data.user?.role;
    if (role === "teacher") {
      router.replace("/teacher/home");
    } else {
      router.replace("/(student-tabs)/home");
    }
    
  } catch (err: any) {
    console.log("LOGIN ERROR:", err?.response?.data || err);
    
    if (err.response) {
    Alert.alert(err.response.data.message);
  } else {
    Alert.alert("Network error. Check server & URL");
  }
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>Create new account</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#4f46e5",
  },
});
