import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router,useFocusEffect} from "expo-router";
import API from "@/constants/api";

export default function StudentHome() {
  const [student, setStudent] = useState<any>(null);
  const [activeClass, setActiveClass] = useState<any>(null);
  const [attendance, setAttendance] = useState({
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

const loadData = async () => {
  try {
    setLoading(true);   // 🔥 ADD THIS LINE

    const userRes = await API.get("/auth/me");
    setStudent(userRes.data);

    const classRes = await API.get("/classes/my");
    setActiveClass(classRes.data[0]);//data[0]

    const attRes = await API.get("/attendance/summary");
   // console.log("SUMMARY RESPONSE:", attRes.data); // 🔥 Debug
    setAttendance(attRes.data);

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
//console.log(activeClass);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  const getColor = () => {
    if (attendance.percentage >= 75) return "#16a34a";
    if (attendance.percentage >= 60) return "#f59e0b";
    return "#dc2626";
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* 1️⃣ Welcome Section */}
      <View style={styles.card}>
        <Text style={styles.welcome}>
          👋 Hello {student?.name}
        </Text>
        <Text>Enrollment No: {student?.enrollment}</Text>
      </View>

      {/* 2️⃣ Active Class */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{"📅 Today's Class"}</Text>

        {activeClass ? (
          <>
            <Text style={styles.className}>
              {activeClass?.subjectName || activeClass?.subject?.name || "No subject "}
            </Text>
            <Text>Teacher: {activeClass?.teacherName || activeClass?.teacherId?.name || "Not Assigned"}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/attendance")}
            >
              <Text style={styles.buttonText}>
                Mark Attendance
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text>No Active Class Right Now</Text>
        )}
      </View>

      {/* 3️⃣ Attendance Summary */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          📊 Attendance Summary
        </Text>

        <Text>Total: {attendance.total}</Text>
        <Text>Present: {attendance.present}</Text>
        <Text>Absent: {attendance.absent}</Text>

        <Text
          style={[
            styles.percentage,
            { color: getColor() },
          ]}
        >
          {attendance.percentage}%
        </Text>
      </View>

      {/* 4️⃣ Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          ⚡ Quick Actions
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/live-map")}
        >
          <Text style={styles.buttonText}>
            📍 Live Map
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/history")}
        >
          <Text style={styles.buttonText}>
            📜 Attendance History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/join-class")}
        >
          <Text style={styles.buttonText}>
            📚 My Classes
          </Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f1f5f9",
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 4,
  },
  welcome: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  className: {
    fontSize: 16,
    fontWeight: "600",
  },
  percentage: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#4f46e5",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
