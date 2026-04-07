
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

