

import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import API from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          router.replace("/login");
        },
      },
    ]);
  };

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );

  const imageUrl = user?.profileImage
    ? API.getUri().replace("/api", "") +
      user.profileImage +
      "?t=" +
      Date.now()
    : null;

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={
            imageUrl
              ? { uri: imageUrl }
              : require("../../assets/images/icon.png")
          }
          style={styles.profileImage}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>{user?.role?.toUpperCase()}</Text>
      </View>

      {/* PERSONAL INFO */}
      <Section title="Personal Information">
        <Field label="Email" value={user?.email} />
        <Field label="Enrollment" value={user?.enrollment || "N/A"} />
        <Field label="Phone" value={user?.phone || "N/A"} />
        <Field label="Address" value={user?.address || "N/A"} />
      </Section>

      {/* ACADEMIC INFO */}
      <Section title="Academic Information">
        <Field label="Department" value={user?.department || "N/A"} />
        <Field label="Course" value={user?.course || "N/A"} />
        <Field label="Role" value={user?.role} />
      </Section>

      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => router.push("/edit-profile")}
      >
        <Text style={styles.btnText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const Section = ({ title, children }: any) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

const Field = ({ label, value }: any) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.fieldBox}>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    backgroundColor: "#4f46e5",
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 10,
  },

  name: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  role: { fontSize: 14, color: "#e0e7ff" },

  sectionContainer: { marginHorizontal: 20, marginTop: 25 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#4338ca",
    marginBottom: 12,
  },

  sectionCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
  },

  fieldWrapper: { marginBottom: 15 },
  fieldLabel: { fontSize: 12, color: "#6b7280", marginBottom: 5 },
  fieldBox: {
    backgroundColor: "#f9fafb",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  fieldValue: { fontSize: 15, fontWeight: "600", color: "#111827" },

  editBtn: {
    backgroundColor: "#4f46e5",
    margin: 20,
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  logoutBtn: {
    backgroundColor: "#ef4444",
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});