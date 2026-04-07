// import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
// import { useEffect, useState } from "react";
// import { useLocalSearchParams } from "expo-router";
// import API from "@/constants/api";

// export default function ViewAttendance() {
//   const { classId } = useLocalSearchParams<{ classId: string }>();
//   const [loading, setLoading] = useState(true);
//   const [records, setRecords] = useState<any[]>([]);
//   const [meta, setMeta] = useState<any>(null);

//   const fetchAttendance = async () => {
//     try {
//       setLoading(true);
//       const res = await API.get(`/attendance/class/${classId}`);
//       setRecords(res.data.records || []);
//       setMeta(res.data);
//     } catch (e: any) {
//       Alert.alert("Error", e?.response?.data?.message || "Failed to load attendance");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (classId) fetchAttendance();
//   }, [classId]);

//   if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

//   return (
//     <View style={{ flex: 1, padding: 16 }}>
//       <Text style={{ fontSize: 18, fontWeight: "bold" }}>
//         {meta?.className || "Class"} Attendance
//       </Text>
//       <Text style={{ color: "#666", marginBottom: 12 }}>
//         Total Records: {meta?.totalRecords ?? records.length}
//       </Text>

//       <TouchableOpacity
//         onPress={fetchAttendance}
//         style={{ backgroundColor: "#4F46E5", padding: 12, borderRadius: 10, marginBottom: 12 }}
//       >
//         <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
//           Refresh
//         </Text>
//       </TouchableOpacity>

//       <FlatList
//         data={records}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <View style={{ backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 10 }}>
//             <Text style={{ fontWeight: "bold" }}>
//               {item.student?.name || "Student"} {item.student?.enrollment ? `(${item.student.enrollment})` : ""}
//             </Text>

//             <Text>Status: {String(item.status || "").toUpperCase()} | {item.locationStatus}</Text>
//             <Text>Date: {new Date(item.date).toLocaleString()}</Text>

//             {typeof item.distance === "number" && (
//               <Text>Distance: {item.distance.toFixed(2)} m</Text>
//             )}
//           </View>
//         )}
//         ListEmptyComponent={
//           <Text style={{ textAlign: "center", marginTop: 30, color: "#666" }}>
//             No attendance records found.
//           </Text>
//         }
//       />
//     </View>
//   );
// }

import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import API from "@/constants/api";

export default function ViewAttendance() {
  const { classId } = useLocalSearchParams<{ classId: string }>();

  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [todayOnly, setTodayOnly] = useState(false);

  // ✅ classId safe string
  const id = Array.isArray(classId) ? classId[0] : classId;

  const fetchAttendance = useCallback(async () => {
    try {
      if (!id) return;

      setLoading(true);

      const url = todayOnly
        ? `/attendance/class/${id}?today=true`//id
        : `/attendance/class/${id}`;
console.log("class id:",id)
console.log("url:",url)
      const res = await API.get(url);

      setRecords(res.data.records || []);
      setMeta(res.data);
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  }, [id, todayOnly]); // ✅ dependency array yahan

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const total = records.length;
  const percent = total === 0 ? 0 : Math.round((present / total) * 100);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        {meta?.className || "Class"} Attendance
      </Text>

      <View
        style={{
          backgroundColor: "#fff",
          padding: 14,
          borderRadius: 12,
          marginVertical: 10,
          elevation: 3,
        }}
      >
        <Text>👨‍🎓 Total Records: {total}</Text>
        <Text>🟢 Present: {present}</Text>
        <Text>🔴 Absent: {absent}</Text>
        <Text>📊 Attendance %: {percent}%</Text>
      </View>

      <TouchableOpacity
        onPress={() => setTodayOnly((p) => !p)}
        style={{
          backgroundColor: todayOnly ? "#16A34A" : "#4F46E5",
          padding: 12,
          borderRadius: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          {todayOnly ? "Showing Today Attendance" : "Show Today Attendance"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={fetchAttendance}
        style={{
          backgroundColor: "#111827",
          padding: 12,
          borderRadius: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          Refresh
        </Text>
      </TouchableOpacity>

      <FlatList
        data={records}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 10 }}>
            <Text style={{ fontWeight: "bold" }}>
              {item.student?.name || "Student"}{" "}
              {item.student?.enrollment ? `(${item.student.enrollment})` : ""}
            </Text>

            <Text>
              Status: {String(item.status || "").toUpperCase()} | {item.locationStatus}
            </Text>
            <Text>Date: {new Date(item.date).toLocaleString()}</Text>

            {typeof item.distance === "number" && (
              <Text>Distance: {item.distance.toFixed(2)} m</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 30, color: "#666" }}>
            No attendance records found.
          </Text>
        }
      />
    </View>
  );
}