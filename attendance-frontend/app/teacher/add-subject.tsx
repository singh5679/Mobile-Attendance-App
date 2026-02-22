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

// export default function AddSubject() {
//   const [name, setName] = useState("");

//   const addSubject = async () => {
//     if (!name) {
//       Alert.alert("Enter subject name");
//       return;
//     }

//     try {
//       await API.post("/subject/add", { name });

//       Alert.alert("Success", "Subject add successfully");
//       setName("");
//     } catch (err: any) {
//       Alert.alert(
//         "Error",
//         err?.response?.data?.message || "Failed to add subject"
//       );
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Add Subject</Text>

//       <TextInput
//         placeholder="Subject Name"
//         style={styles.input}
//         value={name}
//         onChangeText={setName}
//       />

//       <TouchableOpacity style={styles.button} onPress={addSubject}>
//         <Text style={styles.buttonText}>Create Subject</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   title: { fontSize: 22, marginBottom: 20, fontWeight: "bold" },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: "#4F46E5",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: { color: "#fff", fontWeight: "bold" },
// });



import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import API from "@/constants/api";

export default function AddSubject() {
  const [name, setName] = useState("");

  const addSubject = async () => {
    if (!name.trim()) {
      Alert.alert("Enter subject name");
      return;
    }

    try {
      await API.post("/subject/add", {
        name: name.trim(),
      });

      Alert.alert("Success 🎉", "Subject created successfully");
      setName("");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to create subject"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>

        {/* Gradient Header */}
        <LinearGradient
          colors={["#4F46E5", "#7C3AED"]}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Add New Subject</Text>
          <Text style={styles.headerSubtitle}>
            Create and manage subjects easily
          </Text>
        </LinearGradient>

        {/* Card */}
        <View style={styles.card}>

          <Text style={styles.label}>Subject Name</Text>

          <TextInput
            placeholder="e.g. Computer Science"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={addSubject}
          >
            <Text style={styles.buttonText}>
              ➕ Create Subject
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },

  headerSubtitle: {
    marginTop: 6,
    color: "#E0E7FF",
    fontSize: 14,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -30,
    padding: 25,
    borderRadius: 25,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 15,
    borderRadius: 14,
    marginBottom: 20,
    fontSize: 15,
    backgroundColor: "#F9FAFB",
  },

  button: {
    backgroundColor: "#4F46E5",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    elevation: 4,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
