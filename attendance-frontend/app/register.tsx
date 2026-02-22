// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
// import { useState } from "react";
// import { router } from "expo-router";
// import API from "../constants/api";

// export default function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleRegister = async () => {
//     try {
//       await API.post("/auth/register", {
//         name,
//         email,
//         password,
//         role: "student",
//       });

//       Alert.alert("Success", "Registration successful");
//       router.replace("/login");
//     } catch (err: any) {
//       Alert.alert("Register Failed", err.response?.data?.message || "Error");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Register</Text>

//       <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
//       <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
//       <TextInput
//         placeholder="Password"
//         secureTextEntry
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity style={styles.button} onPress={handleRegister}>
//         <Text style={styles.buttonText}>Register</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#f2f2f2",
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 30,
//   },
//   input: {
//     backgroundColor: "#fff",
//     padding: 14,
//     borderRadius: 8,
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: "#4f46e5",
//     padding: 15,
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "600",
//   },
//   link: {
//     marginTop: 15,
//     textAlign: "center",
//     color: "#4f46e5",
//   },
// });

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import API from "@/constants/api";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enrollment, setEnrollment] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const register = async () => {
    try {
      // await API.post("/auth/register", {
      //   name,
      //   email,
      //   password,
      //   role,
      //   enrollment: role === "student" ? enrollment : undefined,
      // });
      await API.post("/auth/register", {
  name,
  email,
  password,
  role,
  enrollment,
  phone,
  address,
  department,
  course,
});


      Alert.alert("Success", "Registered successfully");
      router.replace("/login");
      console.log("BASE URL =>", API.defaults.baseURL);//////
    } catch (err: any) {
      console.log(err?.response?.data || err);
      console.log("STATUS:", err.response?.status);
  console.log("DATA:", err.response?.data);
  console.log("MESSAGE:", err.message);
      Alert.alert("Error", err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* ROLE TOGGLE */}
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleBtn, role === "student" && styles.activeRole]}
          onPress={() => setRole("student")}
        >
          <Text
            style={[styles.roleText, role === "student" && styles.activeText]}
          >
            Student
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleBtn, role === "teacher" && styles.activeRole]}
          onPress={() => setRole("teacher")}
        >
          <Text
            style={[styles.roleText, role === "teacher" && styles.activeText]}
          >
            Teacher
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

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

      {/* STUDENT ONLY */}
      {role === "student" && (
        <TextInput
          placeholder="Enrollment Number"
          style={styles.input}
          value={enrollment}
          onChangeText={setEnrollment}
        />
      )}
      <TextInput placeholder="Phone" style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad"/>
      <TextInput placeholder="Address" style={styles.input} value={address} onChangeText={setAddress} />
      <TextInput placeholder="Department" style={styles.input} value={department} onChangeText={setDepartment} />
      <TextInput placeholder="Course" style={styles.input} value={course} onChangeText={setCourse} />

      <TouchableOpacity style={styles.btn} onPress={register}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#e5eaef",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  roleBtn: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4F46E5",
    marginHorizontal: 8,
  },
  activeRole: {
    backgroundColor: "#4F46E5",
  },
  roleText: {
    color: "#4F46E5",
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    marginTop: 15,
    color: "#4F46E5",
  },
});
