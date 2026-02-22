// import { View, Text } from "react-native";

// export default function TeacherHome() {
//   return (
//     <View>
//       <Text>Welcome Teacher 🧑‍🏫</Text>
//     </View>
//   );
// }

// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { router } from "expo-router";
// import { useAuth } from "../../context/authContext";

// export default function TeacherHome() {
//   const { user, logout } = useAuth();

//   if (!user) return null;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome 👋</Text>
//       <Text style={styles.name}>{user.name}</Text>

//       <View style={styles.card}>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => router.push("/teacher/add-subject")}
//         >
//           <Text style={styles.buttonText}>Add Subject</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => router.push("/teacher/create-class")}
//         >
//           <Text style={styles.buttonText}>Create Class</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => router.push("/teacher/class")}
//         >
//           <Text style={styles.buttonText}>My Classes</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => router.push("/all-students")}
//         >
//           <Text style={styles.buttonText}>All Students</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.button, { backgroundColor: "#E53935" }]}
//           onPress={logout}
//         >
//           <Text style={styles.buttonText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F4F6FA",
//     padding: 20,
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 22,
//     textAlign: "center",
//   },
//   name: {
//     fontSize: 26,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 30,
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 15,
//     elevation: 4,
//   },
//   button: {
//     backgroundColor: "#4F46E5",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/authContext";

export default function TeacherHome() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>👋 Welcome Back</Text>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.subtitle}>Manage your Smart Attendance</Text>
      </View>

      {/* Dashboard Card */}
      <View style={styles.card}>

        <Text style={styles.sectionTitle}>📚 Quick Actions</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/teacher/add-subject")}
        >
          <Text style={styles.buttonText}>➕ Add Subject</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/teacher/create-class")}
        >
          <Text style={styles.buttonText}>🏫 Create Class</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/teacher/class")}
        >
          <Text style={styles.buttonText}>📖 My Classes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/all-students")}
        >
          <Text style={styles.buttonText}>👥 All Students</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={logout}
        >
          <Text style={styles.buttonText}>🚪 Logout</Text>
        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2FF",
  },

  header: {
    backgroundColor: "#4F46E5",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
  },

  welcome: {
    fontSize: 18,
    color: "#E0E7FF",
  },

  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },

  subtitle: {
    marginTop: 5,
    color: "#C7D2FE",
  },

  card: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 6,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
  },

  logoutButton: {
    backgroundColor: "#E53935",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});

