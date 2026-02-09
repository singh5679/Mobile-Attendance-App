// import { View, Text } from "react-native";

// export default function TeacherHome() {
//   return (
//     <View>
//       <Text>Welcome Teacher 🧑‍🏫</Text>
//     </View>
//   );
// }


import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function TeacherHome() {

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    Alert.alert("Logged out");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍🏫 Teacher Dashboard</Text>

      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardText}>📍 Mark Attendance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardText}>📊 View Attendance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} 
       onPress={()=>router.push("/teacher/class")}
       >
      <Text style={styles.cardText} >
          🏫 Manage Classes 
      </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, styles.logout]} onPress={logout}>
        <Text style={[styles.cardText, { color: "#fff" }]}>🚪 Logout</Text>
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
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 2,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  logout: {
    backgroundColor: "#EF4444",
    marginTop: 30,
  },
});

