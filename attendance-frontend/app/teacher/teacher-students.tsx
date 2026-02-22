// import { View, Text } from "react-native";

// export default function StudentList() {
//   return (
//     <View>
//       <Text>Student List</Text>
//     </View>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import API from "@/constants/api";

type StudentType = {
  _id: string;
  name: string;
  enrollment: string;
  email: string;
};

export default function TeacherStudents() {
  const { classId } = useLocalSearchParams(); // get classId from route
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const res = await API.get(`/classes/students/${classId}`);
      setStudents(res.data);
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     if (typeof classId === "string") {
      fetchStudents();
    }
  }, [classId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>👨‍🎓 Students List</Text>

      {students.length === 0 ? (
        <Text style={styles.noData}>No students joined yet</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>Enrollment: {item.enrollment}</Text>
              <Text>Email: {item.email}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4F6FA",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

