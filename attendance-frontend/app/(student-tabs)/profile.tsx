// import { View, Text,Button, Image, StyleSheet } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {router}from "expo-router";

// export default function ProfileScreen() {
//   const logout = async () => {
//     await AsyncStorage.removeItem("token");
//     router.replace("/login");
//   };
//   return (
//     <View style={styles.container}>
//       <Image
//         source={{
//           uri: "https://i.pravatar.cc/150" // demo profile image
//         }}
//         style={styles.profileImage}
//       />
//       <Text style={styles.name}>Himanshu Singh</Text>
//       <Button title="Logout" onPress={logout} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginBottom: 10,
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: "600",
//   },

// });


import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function ProfileScreen() {
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://i.pravatar.cc/150",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>Himanshu Singh</Text>
        <Text style={styles.email}>himanshu@gmail.com</Text>
      </View>

      {/* PERSONAL DETAILS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <ProfileRow label="Phone Number" value="+91 9876543210" />
        <ProfileRow label="Address" value="Lucknow, Uttar Pradesh" />
      </View>

      {/* ACADEMIC DETAILS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Academic Information</Text>

        <ProfileRow label="Enrollment No" value="CS20230123" />
        <ProfileRow label="Department" value="Computer Science" />
        <ProfileRow label="Course" value="B.Tech" />
      </View>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* Reusable Row */
const ProfileRow = ({ label, value }: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#4F46E5",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  email: {
    fontSize: 14,
    color: "#E0E7FF",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: "#777",
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: "#EF4444",
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 30,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
