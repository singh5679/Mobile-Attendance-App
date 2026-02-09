

// import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
// import { useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import API from "@/constants/api";

// type AttendanceItem = {
//   _id: string;
//   date: string;
//   status: string;
// };

// export default function HistoryScreen() {
//   const [data, setData] = useState<AttendanceItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");

//       if (!token) {
//         console.log("No token found");
//         return;
//       }

//       const res = await API.get("/attendance/history", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("History response:", res.data);

//       setData(res.data);
//     } catch (error: any) {
//       console.log("History error:", error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
//   }

//   if (data.length === 0) {
//     return (
//       <View style={styles.center}>
//         <Text>No attendance history found</Text>
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={data}
//       keyExtractor={(item) => item._id}
//       contentContainerStyle={{ padding: 16 }}
//       renderItem={({ item }) => (
//         <View style={styles.card}>
//           <Text style={styles.date}>
//             {new Date(item.date).toDateString()}
//           </Text>
//           <Text style={styles.status}>{item.status}</Text>
//         </View>
//       )}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#f2f2f2",
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   date: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   status: {
//     marginTop: 5,
//     color: "green",
//     fontWeight: "500",
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/constants/api";

type AttendanceItem = {
  _id: string;
  date: string;
  status: string;
};

export default function HistoryScreen() {
  const [history, setHistory] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await API.get("/attendance/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistory(res.data);
    } catch (err) {
      console.log("History fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: AttendanceItem }) => {
    const dateObj = new Date(item.date);

    const formattedDate = dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const formattedTime = dateObj.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View style={styles.card}>
        <View>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.time}>{formattedTime}</Text>
        </View>

        <View
          style={[
            styles.badge,
            item.status === "Present"
              ? styles.present
              : styles.absent,
          ]}
        >
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No attendance history found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Attendance History</Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  date: {
    fontSize: 16,
    fontWeight: "600",
  },
  time: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  present: {
    backgroundColor: "#0a640d",
  },
  absent: {
    backgroundColor: "#c11b1b",
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});

