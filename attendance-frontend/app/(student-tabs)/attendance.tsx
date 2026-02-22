// import {
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
// } from "react-native";
// import { useEffect, useState } from "react";
// import * as Location from "expo-location";
// import { router } from "expo-router";
// import API from "@/constants/api";

// type ClassType = {
//   _id: string;
//   name: string;
//   subject?: {
//     name: string;
//   };
// };

// export default function MarkAttendance() {
//   const [classes, setClasses] = useState<ClassType[]>([]);
//   const [classId, setClassId] = useState<string>("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const res = await API.get("/classes/my");
//         setClasses(res.data);
//       } catch (err: any) {
//         console.log(err);
//         Alert.alert("Error", "Failed to load classes");
//       }
//     };

//     fetchClasses();
//   }, []);

//   const markAttendance = async () => {
//     try {
//       setLoading(true);

//       if (!classId) {
//         Alert.alert("Select Class", "Please select a class first");
//         return;
//       }

//       const { status } = await Location.requestForegroundPermissionsAsync();

//       if (status !== "granted") {
//         Alert.alert("Permission Denied", "Enable location permission");
//         return;
//       }

//       const loc = await Location.getCurrentPositionAsync({});

//       const res = await API.post("/attendance/mark", {
//         latitude: loc.coords.latitude,
//         longitude: loc.coords.longitude,
//         classId,
//       });

//       Alert.alert(
//         "Attendance Marked ✅",
//         `Status: ${res.data.status.toUpperCase()}
// Distance: ${res.data.distance.toFixed(2)} meters`,
//         [
//           {
//             text: "OK",
//             onPress: () => router.back(), // 🔥 Go back to Home
//           },
//         ]
//       );

//     } catch (err: any) {
//       Alert.alert(
//         "Error",
//         err?.response?.data?.message || "Server error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.heading}>📍 Mark Attendance</Text>
//       <Text style={styles.subHeading}>Select Your Class</Text>

//       {classes.map((c) => (
//         <TouchableOpacity
//           key={c._id}
//           style={[
//             styles.subjectCard,
//             classId === c._id && styles.selectedCard,
//           ]}
//           onPress={() => setClassId(c._id)}
//         >
//           <Text
//             style={[
//               styles.subjectText,
//               classId === c._id && styles.selectedText,
//             ]}
//           >
//             {c.name} {c.subject?.name ? `(${c.subject.name})` : ""}
//           </Text>
//         </TouchableOpacity>
//       ))}

//       <TouchableOpacity
//         style={[
//           styles.markButton,
//           (!classId || loading) && { opacity: 0.6 },
//         ]}
//         disabled={!classId || loading}
//         onPress={markAttendance}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.markButtonText}>🚀 Mark Now</Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: "#F4F6FA",
//     flexGrow: 1,
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   subHeading: {
//     color: "#666",
//     marginBottom: 20,
//   },
//   subjectCard: {
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 14,
//     marginBottom: 12,
//     elevation: 3,
//   },
//   selectedCard: {
//     backgroundColor: "#4F46E5",
//   },
//   subjectText: {
//     fontSize: 16,
//   },
//   selectedText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   markButton: {
//     marginTop: 25,
//     backgroundColor: "#4F46E5",
//     padding: 18,
//     borderRadius: 14,
//     alignItems: "center",
//     elevation: 4,
//   },
//   markButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
//import { router } from "expo-router";
import API from "@/constants/api";

type ClassType = {
  _id: string;
  name: string;
  subject?: {
    name: string;
  };
};

export default function MarkAttendance() {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [classId, setClassId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("/classes/my");
        setClasses(res.data);
      } catch (err: any) {
        console.log(err);
        Alert.alert("Error", "Failed to load classes");
      }
    };

    fetchClasses();
  }, []);

  const markAttendance = async () => {
    try {
      setLoading(true);

      if (!classId) {
        Alert.alert("Select Class", "Please select a class first");
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied", "Enable location permission");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const res = await API.post("/attendance/mark", {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        classId,
      });

      setResult(res.data);
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = () => {
    if (!result) return "#000";

    if (result.locationStatus === "INSIDE") return "green";
    if (result.locationStatus === "BOUNDARY") return "orange";
    return "red";
  };

  const getEmoji = () => {
    if (!result) return "";
    if (result.locationStatus === "INSIDE") return "🟢";
    if (result.locationStatus === "BOUNDARY") return "🟡";
    return "🔴";
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>📍 Mark Attendance</Text>
      <Text style={styles.subHeading}>Select Your Class</Text>

      {classes.map((c) => (
        <TouchableOpacity
          key={c._id}
          style={[styles.subjectCard, classId === c._id && styles.selectedCard]}
          onPress={() => setClassId(c._id)}
        >
          <Text
            style={[
              styles.subjectText,
              classId === c._id && styles.selectedText,
            ]}
          >
            {c.name} {c.subject?.name ? `(${c.subject.name})` : ""}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.markButton, (!classId || loading) && { opacity: 0.6 }]}
        disabled={!classId || loading}
        onPress={markAttendance}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.markButtonText}>🚀 Mark Now</Text>
        )}
      </TouchableOpacity>

      {/* RESULT CARD */}
      {result && (
        <View style={[styles.resultCard, { borderColor: getResultColor() }]}>
          <Text style={[styles.resultTitle, { color: getResultColor() }]}>
            {getEmoji()} {result.status.toUpperCase()}
          </Text>

          <Text style={styles.resultText}>
            📍 Location: {result.locationStatus}
          </Text>

          <Text style={styles.resultText}>
            📏 Distance: {result.distance.toFixed(2)} m
          </Text>

          <Text style={styles.resultText}>
            🎯 Allowed Radius: {result.allowedRadius} m
          </Text>
          <Text style={styles.resultText}>🌍 Latitude: {result.latitude}</Text>

          <Text style={styles.resultText}>
            🌎 Longitude: {result.longitude}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F4F6FA",
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subHeading: {
    color: "#666",
    marginBottom: 20,
  },
  subjectCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: "#4F46E5",
  },
  subjectText: {
    fontSize: 16,
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  markButton: {
    marginTop: 25,
    backgroundColor: "#4F46E5",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    elevation: 4,
  },
  markButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultCard: {
    marginTop: 25,
    padding: 18,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 2,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 15,
    marginBottom: 5,
  },
});
