

import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  View,
  FlatList,
} from "react-native";
import API from "@/constants/api";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { Swipeable } from "react-native-gesture-handler";

type Subject = {
  _id: string;
  name: string;
};

type ClassType = {
  _id: string;
  subject: {
    name: string;
  };
  radius: number;
  latitude: number;
  longitude: number;
};

export default function CreateClass() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [radius, setRadius] = useState("100");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await API.get("/subject/all");
      setSubjects(res.data);
    } catch {
      Alert.alert("Failed to load subjects");
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes/all");
      setClasses(res.data);
    } catch {
      Alert.alert("Failed to load classes");
    }
  };

  // 🔴 DELETE CLASS
  const deleteClass = async (id: string) => {
    try {
      await API.delete(`/classes/${id}`);
      fetchClasses();
    } catch {
      Alert.alert("Failed to delete class");
    }
  };

  // 🔴 DELETE SUBJECT
  const deleteSubject = async (id: string) => {
    Alert.alert("Delete Subject", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await API.delete(`/subject/${id}`);
            fetchSubjects();
          } catch {
            Alert.alert("Failed to delete subject");
          }
        },
      },
    ]);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Location permission required");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setLatitude(loc.coords.latitude.toString());
      setLongitude(loc.coords.longitude.toString());

      Alert.alert("Location Captured 📍");
    } catch {
      Alert.alert("Error getting location");
    }
  };

  const createClass = async () => {
    if (!subjectId) return Alert.alert("Select subject");
    if (!latitude || !longitude) return Alert.alert("Location required");

    try {
      await API.post("/classes/add", {
        subject: subjectId,
        latitude: Number(latitude),
        longitude: Number(longitude),
        radius: Number(radius),
      });

      Alert.alert("Success 🎉", "Class created successfully");

      setLatitude("");
      setLongitude("");
      setRadius("100");
      setSubjectId("");

      fetchClasses();
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to create class",
      );
    }
  };

  const renderClassRight = (id: string) => (
    <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteClass(id)}>
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderSubjectRight = (id: string) => (
    <TouchableOpacity
      style={styles.deleteBtn}
      onPress={() => deleteSubject(id)}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#4F46E5", "#7C3AED"]} style={styles.header}>
        <Text style={styles.headerTitle}>Create Class</Text>
        <Text style={styles.headerSub}>Setup geo attendance class</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.label}>Select Subject</Text>

        <FlatList
          data={subjects}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderSubjectRight(item._id)}>
              <TouchableOpacity
                style={[
                  styles.subjectBtn,
                  subjectId === item._id && styles.selected,
                ]}
                onPress={() => setSubjectId(item._id)}
              >
                <Text
                  style={
                    subjectId === item._id
                      ? styles.selectedText
                      : styles.normalText
                  }
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            </Swipeable>
          )}
        />

        <TouchableOpacity
          style={styles.locationBtn}
          onPress={getCurrentLocation}
        >
          <Text style={styles.buttonText}>📍 Capture Location</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Latitude"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Longitude"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Radius (meters)"
          value={radius}
          onChangeText={setRadius}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity style={styles.createBtn} onPress={createClass}>
          <Text style={styles.createText}>🚀 Create Class</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
        <Text style={styles.label}>Created Classes</Text>

        <FlatList
          data={classes}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderClassRight(item._id)}>
              <View style={styles.classCard}>
                <Text style={styles.classTitle}>{item.subject?.name}</Text>
                <Text style={styles.classSub}>     Radius: {item.radius}m</Text>
                <Text style={styles.classSub}>📍 Lat: {item.latitude}</Text>
                <Text style={styles.classSub}>📍 Long: {item.longitude}</Text>
              </View>
            </Swipeable>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },

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

  headerSub: {
    marginTop: 5,
    color: "#E0E7FF",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -30,
    padding: 25,
    borderRadius: 25,
    elevation: 8,
  },

  label: {
    fontWeight: "600",
    marginBottom: 10,
    fontSize: 14,
  },

  subjectBtn: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },

  selected: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },

  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },

  normalText: {
    color: "#374151",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    borderRadius: 12,
    marginVertical: 8,
    backgroundColor: "#F9FAFB",
  },

  locationBtn: {
    backgroundColor: "#10B981",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },

  buttonText: { color: "#fff", fontWeight: "bold" },

  createBtn: {
    backgroundColor: "#4F46E5",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  createText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  classCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 3,
  },

  classTitle: { fontWeight: "bold", fontSize: 16 },

  classSub: { marginTop: 3, color: "#6B7280" },

  deleteBtn: {
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 15,
    marginBottom: 10,
  },

  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
