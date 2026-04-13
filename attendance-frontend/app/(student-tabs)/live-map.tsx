import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
  Text,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import API from "@/constants/api";

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371e3;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export default function LiveMap() {
  const [teacherLocation, setTeacherLocation] = useState<any>(null);
  const [studentLocation, setStudentLocation] = useState<any>(null);
  const [radius, setRadius] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const start = async()=>{
        initializeMap();
    }
    start();
    
    //addddd
    const interval = setInterval(async()=>{
       await initializeMap();  //will also update student location
    },5000);
    return ()=>clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   if (!teacherLocation) return;

  //   const interval = setInterval(() => {
  //     updateStudentLocation();
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [teacherLocation]);

  const initializeMap = async () => {
    try {
      // 🔥 Ask permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location permission");
        return;
      }

      // 🔥 Check if GPS enabled
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert("GPS OFF", "Please enable location services");
        return;
      }

      const res = await API.get("/classes/my");
      const classData = res.data[0];

      const teacherLat = Number(classData.latitude);
      const teacherLng = Number(classData.longitude);

      setTeacherLocation({
        latitude: teacherLat,
        longitude: teacherLng,
      });

      setRadius(Number(classData.radius));

      await updateStudentLocation(teacherLat, teacherLng);

    } catch (err: any) {
      console.log("INIT ERROR:", err);
      Alert.alert("Error", err.message || "Failed to load map");
    } finally {
      setLoading(false);
    }
  };

  const updateStudentLocation = async (
    teacherLat?: number,
    teacherLng?: number
  ) => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert("GPS OFF", "Please enable location services");
        return;
      }

      // 🔥 Try last known location first
      let loc = await Location.getLastKnownPositionAsync();

      if (!loc) {
        loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
      }

      if (!loc) {
        Alert.alert("Location Error", "Unable to fetch location");
        return;
      }

      const studentLat = loc.coords.latitude;
      const studentLng = loc.coords.longitude;

      setStudentLocation({
        latitude: studentLat,
        longitude: studentLng,
      });

      const tLat = teacherLat ?? teacherLocation.latitude;
      const tLng = teacherLng ?? teacherLocation.longitude;

      const dist = calculateDistance(tLat, tLng, studentLat, studentLng);
      setDistance(dist);

    } catch (error: any) {
      console.log("LOCATION ERROR:", error);
      Alert.alert("Location Error", error.message || "Unable to get location");
    }
  };

  if (loading || !teacherLocation || !studentLocation) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  const isInside = distance <= radius;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.infoBox}>
        <Text>Distance: {distance.toFixed(2)} meters</Text>
        <Text>Allowed Radius: {radius} meters</Text>
        <Text>
          Status: {isInside ? "✅ Inside Radius" : "❌ Outside Radius"}
        </Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: studentLocation.latitude,
          longitude: studentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={teacherLocation}
          title="Teacher Location"
          pinColor="blue"
        />

        <Marker
          coordinate={studentLocation}
          title="Your Location"
          pinColor="red"
        />

        <Circle
          center={teacherLocation}
          radius={radius}
          strokeColor={
            isInside
              ? "rgba(0,200,0,0.8)"
              : "rgba(200,0,0,0.8)"
          }
          fillColor={
            isInside
              ? "rgba(0,200,0,0.2)"
              : "rgba(200,0,0,0.2)"
          }
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  infoBox: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    elevation: 5,
    zIndex: 1,
  },
});
