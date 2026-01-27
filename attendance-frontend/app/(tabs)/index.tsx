import { View, Text,StyleSheet  } from "react-native";
//zzzzz import AttendanceButton from "@/components/AttendanceButton";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Dashboard</Text>
      <Text>Welcome! You are logged in.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});