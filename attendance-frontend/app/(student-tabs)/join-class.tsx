// import { useState } from "react";
// import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
// import API from "@/constants/api";

// export default function JoinClass() {
//   const [classId, setClassId] = useState("");

//   const handleJoin = async () => {
//     try {
//       await API.post("/classes/join", { classId });
//       Alert.alert("Success", "Joined class successfully");
//     } catch (err: any) {
//       Alert.alert("Error", err?.response?.data?.message || "Failed");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Enter Class ID"
//         value={classId}
//         onChangeText={setClassId}
//         style={styles.input}
//       />
//       <Button title="Join Class" onPress={handleJoin} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   input: {
//     borderWidth: 1,
//     padding: 10,
//     marginBottom: 15,
//     borderRadius: 8,
//   },
// });

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import API from "@/constants/api";

export default function JoinClass() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes/all");
      setClasses(res.data);
    } catch (err) {
      console.error("Fetch classes error:", err);
      Alert.alert("Error", "Failed to load classes");
    }
  };

  const handleJoin = async (classId: string) => {
    try {
      await API.post(`/classes/join/${classId}`);
      Alert.alert("Success", "Joined class successfully");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Join failed"
      );
    }
  };

  return (
    <FlatList
      data={classes}
      keyExtractor={(item: any) => item._id}
      renderItem={({ item }: any) => (
        <View style={styles.card}>
          <Text style={styles.subject}>
            Subject: {item.subject?.name}
          </Text>
          <Text>Teacher: {item.teacherId?.name}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleJoin(item._id)}
          >
            <Text style={styles.buttonText}>Join Class</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
  },
  subject: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#4F46E5",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
