import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

type User = {
  id: string;
  name: string;
  role: "student" | "teacher";
};

type AuthContextType = {
  user: User | null;
  login: (data: { token: string; user: User }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Load user from storage on app start
  useEffect(() => {
    const loadAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");

      if (token && userData) {
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    };

    loadAuth();
  }, []);

  const login = async (data: { token: string; user: User }) => {
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));

     console.log("Saved user:", data.user); // 👈 YE LINE ADD KARO

    setUser(data.user);

    // 🔀 role based redirect
    // if (data.user.role === "teacher") {
    //   router.replace("/teacher/home");
    // } else {
    //   router.replace("/(student-tabs)/home");
    // }
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
