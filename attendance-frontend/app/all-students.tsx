// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import API from "@/constants/api";

// type Student = {
//   _id: string;
//   name: string;
//   enrollment: string;
//   email: string;
// };

// export default function AllStudents() {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const res = await API.get("/auth/students");
//         setStudents(res.data);
//       } catch (err: any) {
//         console.log(err);
//         Alert.alert("Error", "Failed to load students");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#4F46E5" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>👨‍🎓 All Registered Students</Text>

//       <FlatList
//         data={students}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Text style={styles.name}>Name:{item.name}</Text>
//             <Text>Enrollment: {item.enrollment}</Text>
//             <Text>Email: {item.email}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#F4F6FA",
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 15,
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 12,
//     marginBottom: 10,
//     elevation: 3,
//   },
//   name: {
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });


//2
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import API from "@/constants/api";
import { LinearGradient } from "expo-linear-gradient";

type Student = {
  _id: string;
  name: string;
  enrollment: string;
  email: string;
};

export default function AllStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get("/auth/students");
        setStudents(res.data);
      } catch (err: any) {
        console.log(err);
        Alert.alert("Error", "Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const renderStudent = ({ item }: { item: Student }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.enrollment}>
          Enrollment: {item.enrollment}
        </Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4F46E5", "#7C3AED"]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>
          All Students
        </Text>
        <Text style={styles.headerSub}>
          Total Registered: {students.length}
        </Text>
      </LinearGradient>

      <FlatList
        data={students}
        keyExtractor={(item) => item._id}
        renderItem={renderStudent}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

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
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 6,
    alignItems: "center",
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  enrollment: {
    fontSize: 13,
    marginTop: 4,
    color: "#4F46E5",
    fontWeight: "600",
  },

  email: {
    fontSize: 12,
    marginTop: 2,
    color: "#6B7280",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
