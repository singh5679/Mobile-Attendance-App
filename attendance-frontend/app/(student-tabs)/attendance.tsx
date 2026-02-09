// import { View, Text, Button, Alert } from "react-native";
// import API from "@/constants/api";
// import { getCurrentLocation } from "@/hooks/useGeofence";

// export default function AttendanceScreen() {

//   const markAttendance = async () => {
//     try {
//       const location = await getCurrentLocation();

//       const response = await API.post("/attendance/mark", {
//         latitude: location.latitude,
//         longitude: location.longitude,
//       });

//       Alert.alert(
//         "Attendance Result",
//         `${response.data.message}\nStatus: ${response.data.status}`
//       );

//     } catch (error: any) {
//       console.log(error?.response?.data || error);
//       Alert.alert("Error", "Could not mark attendance");
//     }
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#f5f7fb",
//       }}
//     >
//       <Text style={{ fontSize: 20, marginBottom: 20, fontWeight: "600" }}>
//         Geo-Fence Attendance
//       </Text>

//       <Button title="Mark Attendance" onPress={markAttendance} />
//     </View>
//   );
// }




// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import { useState } from "react";
// import * as Device from "expo-device";
// import API from "@/constants/api";
// import { getCurrentLocation } from "@/hooks/useGeofence";

// export default function AttendanceScreen() {
//   const [location, setLocation] = useState<any>(null);
//   const [result, setResult] = useState<any>(null);
//   const [distance, setDistance] = useState<number | null>(null);

//   // 🔹 Campus location (example – change if needed)
//   const CAMPUS_LAT = 26.8467;
//   const CAMPUS_LNG = 80.9462;

//   // 🔹 Haversine distance (meters)
//   const calculateDistance = (
//     lat1: number,
//     lon1: number,
//     lat2: number,
//     lon2: number
//   ) => {
//     const toRad = (v: number) => (v * Math.PI) / 180;
//     const R = 6371e3;

//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);

//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(toRad(lat1)) *
//         Math.cos(toRad(lat2)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return Math.round(R * c);
//   };

//   const markAttendance = async () => {
//     try {
//       const loc = await getCurrentLocation();
//       setLocation(loc);

//       const dist = calculateDistance(
//         loc.latitude,
//         loc.longitude,
//         CAMPUS_LAT,
//         CAMPUS_LNG
//       );
//       setDistance(dist);

//       const response = await API.post("/attendance/mark", {
//         latitude: loc.latitude,
//         longitude: loc.longitude,
//       });

//       setResult({
//         status: response.data.status,
//         message: response.data.message,
//         time: new Date().toLocaleTimeString(),
//         date: new Date().toDateString(),
//       });

//       Alert.alert("Attendance", response.data.message);
//     } catch (error: any) {
//       console.log(error?.response?.data || error);
//       Alert.alert("Error", "Could not mark attendance");
//     }
//   };

//   const statusColor =
//     result?.status === "Present"
//       ? "#22C55E"
//       : result?.status
//       ? "#EF4444"
//       : "#999";

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Geo-Fence Attendance</Text>

//       {/* DEVICE INFO */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Device Info</Text>
//         <Text style={styles.info}>OS: {Device.osName}</Text>
//         <Text style={styles.info}>Model: {Device.modelName}</Text>
//       </View>

//       {/* LOCATION INFO */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Device Location</Text>
//         <Text style={styles.info}>
//           Latitude: {location?.latitude ?? "Not fetched"}
//         </Text>
//         <Text style={styles.info}>
//           Longitude: {location?.longitude ?? "Not fetched"}
//         </Text>
//         <Text style={styles.info}>
//           Distance from Campus:{" "}
//           {distance !== null ? `${distance} meters` : "Not calculated"}
//         </Text>
//       </View>

//       {/* ATTENDANCE RESULT */}
//       {result && (
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Attendance Status</Text>

//           <View
//             style={[
//               styles.badge,
//               { backgroundColor: statusColor },
//             ]}
//           >
//             <Text style={styles.badgeText}>{result.status}</Text>
//           </View>

//           <Text style={styles.info}>Date: {result.date}</Text>
//           <Text style={styles.info}>Time: {result.time}</Text>
//           <Text style={styles.message}>{result.message}</Text>
//         </View>
//       )}

//       {/* BUTTON */}
//       <TouchableOpacity style={styles.button} onPress={markAttendance}>
//         <Text style={styles.buttonText}>Mark Attendance</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F4F6FA",
//     padding: 16,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginVertical: 20,
//     textAlign: "center",
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 14,
//     marginBottom: 16,
//     elevation: 3,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     marginBottom: 10,
//   },
//   info: {
//     fontSize: 14,
//     marginBottom: 6,
//     color: "#333",
//   },
//   badge: {
//     alignSelf: "flex-start",
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginBottom: 10,
//   },
//   badgeText: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 14,
//   },
//   message: {
//     marginTop: 8,
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#4F46E5",
//   },
//   button: {
//     backgroundColor: "#4F46E5",
//     paddingVertical: 14,
//     borderRadius: 14,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//   },
// });




import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import API from "@/constants/api";
import { getCurrentLocation } from "@/hooks/useGeofence";

export default function AttendanceScreen() {
  const [location, setLocation] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // ⚠️ TEMP: subjectId (later pass from class/subject screen)
  const subjectId = "PUT_REAL_SUBJECT_ID_HERE";

  const markAttendance = async () => {
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);

      const response = await API.post("/attendance/mark", {
        latitude: loc.latitude,
        longitude: loc.longitude,
        subjectId, // 🔥 VERY IMPORTANT
      });

      setDistance(response.data.distance);

      setResult({
        status: response.data.status,
        message: response.data.message,
        time: new Date().toLocaleTimeString(),
        date: new Date().toDateString(),
      });

      Alert.alert("Attendance", response.data.message);
    } catch (error: any) {
      console.log("ATTENDANCE ERROR:", error?.response?.data || error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Could not mark attendance"
      );
    }
  };

  const statusColor =
    result?.status === "present"
      ? "#22C55E"
      : result?.status === "absent"
      ? "#EF4444"
      : "#999";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Geo-Fence Attendance</Text>

      {location && (
        <View style={styles.card}>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
          <Text>
            Distance: {distance ? `${distance} meters` : "N/A"}
          </Text>
        </View>
      )}

      {result && (
        <View style={styles.card}>
          <View style={[styles.badge, { backgroundColor: statusColor }]}>
            <Text style={styles.badgeText}>
              {result.status.toUpperCase()}
            </Text>
          </View>

          <Text>{result.date}</Text>
          <Text>{result.time}</Text>
          <Text style={styles.message}>{result.message}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={markAttendance}>
        <Text style={styles.buttonText}>Mark Attendance</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
  },
  message: {
    marginTop: 6,
    fontWeight: "600",
    color: "#4F46E5",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
