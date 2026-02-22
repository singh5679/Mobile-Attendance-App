import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import API from "@/constants/api";

type Attendance = {
  _id: string;
  status: string;
  date: string;
  subjectId?: {
    name: string;
  };
};

export default function History() {
  const [data, setData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/attendance/history");
        setData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDateTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16 }}>No attendance records found</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 15 }}
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {/* Subject */}
          <Text style={styles.subject}>
            {item.subjectId?.name || "Unknown Subject"}
          </Text>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              item.status === "present"
                ? styles.present
                : styles.absent,
            ]}
          >
            <Text style={styles.statusText}>
              {item.status.toUpperCase()}
            </Text>
          </View>

          {/* Date & Time */}
          <Text style={styles.date}>
            {formatDateTime(item.date)}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 4,
  },
  subject: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  present: {
    backgroundColor: "#4CAF50",
  },
  absent: {
    backgroundColor: "#E53935",
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
  },
  date: {
    color: "#666",
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
