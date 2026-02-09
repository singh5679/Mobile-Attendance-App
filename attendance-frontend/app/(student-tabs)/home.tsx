

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import API from "@/constants/api";

type ClassItem = {
  _id: string;
  subject: string;
  radius: number;
};

export default function Home() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await API.get("/class/all");
      setClasses(res.data);
    } catch (err: any) {
      console.log("FETCH CLASS ERROR:", err?.response?.data || err);
      Alert.alert("Error", "Could not load classes");
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = (classId: string) => {
    router.push({
      pathname: "/attendance",
      params: { classId },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.collegeName}>Integral University Lucknow</Text>
        <Text style={styles.subtitle}>Student Dashboard</Text>
      </View>

      {/* Class List */}
      <Text style={styles.sectionTitle}>📚 Your Classes</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.subject}>{item.subject}</Text>
              <Text style={styles.radius}>
                Radius: {item.radius} meters
              </Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => markAttendance(item._id)}
              >
                <Text style={styles.buttonText}>Mark Attendance</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* History */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/history")}
      >
        <Text style={styles.secondaryText}>View Attendance History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  collegeName: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  subject: {
    fontSize: 16,
    fontWeight: "700",
  },
  radius: {
    fontSize: 12,
    color: "gray",
    marginVertical: 6,
  },
  primaryButton: {
    backgroundColor: "#4f46e5",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },
  secondaryText: {
    color: "#4f46e5",
    fontWeight: "600",
  },
});
