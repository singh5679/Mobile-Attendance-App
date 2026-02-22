
// import { Stack } from "expo-router";
// import { AuthProvider } from "../context/authContext";

// export default function RootLayout() {

//   return (
//     <AuthProvider>
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" />
//       <Stack.Screen name="login" />
//       <Stack.Screen name="register" />
//       <Stack.Screen name="(student-tabs)" />
//       <Stack.Screen name="teacher" />
//     </Stack>
//     </AuthProvider>
//   );
// }


// import { Stack } from "expo-router";
// import { AuthProvider } from "../context/authContext";


// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <Stack screenOptions={{ headerShown: false }} />
//     </AuthProvider>
//   );
// }


import { Stack } from "expo-router";
import { AuthProvider } from "../context/authContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

