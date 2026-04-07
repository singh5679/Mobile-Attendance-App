import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import API from "@/constants/api";

export default function TeacherClasses() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes/my");
      setClasses(res.data);
    } catch (error) {
      console.error("Fetch classes error:", error);
      alert("Failed to load classes");
    }
  };

  // 🔴 DELETE FUNCTION
  const handleDelete = (id: string) => {
    Alert.alert("Delete Class", "Are you sure you want to delete this class?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await API.delete(`/classes/${id}`);

            // remove from UI
            setClasses((prev: any) => prev.filter((c: any) => c._id !== id));

            alert("Class deleted successfully");
          } catch (error) {
            console.error("Delete class error:", error);
            alert("Delete failed");
          }
        },
      },
    ]);
  };

  return (
    <FlatList
      data={classes}
      keyExtractor={(c: any) => c._id}
      renderItem={({ item }: any) => (
        <View style={styles.card}>
          <Text style={styles.subject}>Subject: {item.subject?.name}</Text>

          <Text>Students: {item.students.length}</Text>

          {/* ✅ View Students */}

          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() =>
              router.push(`/teacher/view-attendance?classId=${item._id}`)
            }
          >
            <Text style={styles.viewBtnText}>👀 View Attendance</Text>
          </TouchableOpacity>

          {/* 🔴 Delete Button */}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item._id)}
          >
            <Text style={styles.deleteText}>Delete Class</Text>
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
  deleteBtn: {
    marginTop: 8,
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  viewBtn: {
  marginTop: 10,
  backgroundColor: "#16A34A",
  padding: 10,
  borderRadius: 10,
  alignItems: "center",
},
viewBtnText: {
  color: "#fff",
  fontWeight: "bold",
},
});
