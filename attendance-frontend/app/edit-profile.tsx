

// EditProfile.tsx
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import API from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditProfile() {
  const [user, setUser] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [image, setImage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await API.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(res.data);
    setPhone(res.data.phone || "");
    setAddress(res.data.address || "");
    setDepartment(res.data.department || "");
    setCourse(res.data.course || "");
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem("token");

    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("department", department);
    formData.append("course", course);

    if (image) {
      formData.append("profileImage", {
        uri: image,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);
    }

    try {
      await API.put("/auth/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Profile Updated");
      router.replace("/profile");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Update Failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text>Tap to Select Image</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={user?.name || ""}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        style={styles.input}
        placeholder="Department"
        value={department}
        onChangeText={setDepartment}
      />

      <TextInput
        style={styles.input}
        placeholder="Course"
        value={course}
        onChangeText={setCourse}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f4f6f8", flexGrow: 1 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  imageContainer: {
    alignSelf: "center",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});