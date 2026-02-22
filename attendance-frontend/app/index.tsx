// import { useEffect } from "react";
// import { router } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { View, ActivityIndicator } from "react-native";

// export default function Index() {
//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = await AsyncStorage.getItem("token");
//       const role = await AsyncStorage.getItem("role");

//       if (!token) {
//         router.replace("/login");
//       } else if (role === "teacher") {
//         router.replace("/teacher/home");
//       } else {
//         router.replace("/(student-tabs)/home");
//       }
//     };

//     checkAuth();
//   }, []);

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <ActivityIndicator size="large" />
//     </View>
//   );
// }


// import { useEffect } from "react";
// import { router } from "expo-router";
// import { View, ActivityIndicator } from "react-native";
// import { useAuth } from "@/context/authContext";


// export default function Index() {
//   const { user, loading } = useAuth();

//   useEffect(() => {
//     if (loading) return;

//     if (!user) {
//       router.replace("/login");
//     } else if (user.role === "teacher") {
//       router.replace("/teacher/home");
//     } else {
//       router.replace("/(student-tabs)/home");
//     }
//   }, [user, loading]);

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <ActivityIndicator size="large" />
//     </View>
//   );
// }


// import { Redirect } from "expo-router";
// import { useAuth } from "@/context/authContext";
// import { View, ActivityIndicator } from "react-native";

// export default function Index() {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (!user) {
//     return <Redirect href="/login" />;
//   }

//   if (user.role === "teacher") {
//     return <Redirect href="/teacher/home" />;
//   }

//   return <Redirect href="/(student-tabs)/home" />;
// }


import { useEffect } from "react";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@/context/authContext";

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (user) {
      if (user.role === "teacher") {
        router.replace("/teacher/home");
      } else {
        router.replace("/(student-tabs)/home");
      }
    } else {
      router.replace("/login");
    }
  }, [user, loading]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

