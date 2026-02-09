// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import { useState } from "react";
// import API from "@/constants/api";
// import { router } from "expo-router";

// export default function ClassScreen() {
//   const [className, setClassName] = useState("");
//   const [subject, setSubject] = useState("");
//   const [department, setDepartment] = useState("");
//   const [section, setSection] = useState("");

//   const createClass = async () => {
//   if (!className || !subject) {
//     return Alert.alert("Error", "Class name and subject required");
//   }

//   try {
//     await API.post("/class/add", {
//       subject,
//       date: new Date(),
//       latitude: 26.8467,      // demo
//       longitude: 80.9462,
//       //radius: 200,
//     });

//     Alert.alert("Success", "Class created successfully");
//     router.back();
//   } catch (err: any) {
//     console.log(err?.response?.data || err);
//     Alert.alert("Error", err?.response?.data?.message || "Could not create class");
//   }
// };


//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🏫 Create Class</Text>

//       <TextInput
//         placeholder="Class Name (e.g. BCA 3rd Year)"
//         style={styles.input}
//         value={className}
//         onChangeText={setClassName}
//       />

//       <TextInput
//         placeholder="Subject (e.g. Data Structures)"
//         style={styles.input}
//         value={subject}
//         onChangeText={setSubject}
//       />

//       <TextInput
//         placeholder="Department (e.g. Computer Science)"
//         style={styles.input}
//         value={department}
//         onChangeText={setDepartment}
//       />

//       <TextInput
//         placeholder="Section (A / B)"
//         style={styles.input}
//         value={section}
//         onChangeText={setSection}
//       />

//       <TouchableOpacity style={styles.btn} onPress={createClass}>
//         <Text style={styles.btnText}>Create Class</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#F4F6FA",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   input: {
//     backgroundColor: "#fff",
//     padding: 14,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   btn: {
//     backgroundColor: "#4F46E5",
//     padding: 15,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   btnText: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 16,
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
import API from "@/constants/api";
import { router } from "expo-router";

export default function ClassScreen() {
  const [subject, setSubject] = useState("");
  const [radius, setRadius] = useState("");

  const createClass = async () => {
    if (!subject || !radius) {
      return Alert.alert("Error", "Subject and radius are required");
    }

    try {
      await API.post("/class/add", {
        subject,
        latitude: 26.8467,   // demo campus latitude
        longitude: 80.9462,  // demo campus longitude
        radius: Number(radius),
      });

      Alert.alert("Success", "Class created successfully");
      router.back();
    } catch (err: any) {
      console.log("CREATE CLASS ERROR:", err?.response?.data || err);
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Could not create class"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏫 Create Class</Text>

      <TextInput
        placeholder="Subject (e.g. Data Structures)"
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
      />

      <TextInput
        placeholder="Attendance Radius (meters)"
        style={styles.input}
        value={radius}
        onChangeText={setRadius}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.btn} onPress={createClass}>
        <Text style={styles.btnText}>Create Class</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4F6FA",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
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
});
