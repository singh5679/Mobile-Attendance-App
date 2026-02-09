// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="login" />
//       <Stack.Screen name="register" />
//       <Stack.Screen name="(tabs)" />
//     </Stack>
//   );
// }

import { Stack } from "expo-router";
// import { useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  // const [isAuth, setIsAuth] = useState<boolean | null>(null);

  // useEffect(() => {
  //   AsyncStorage.getItem("token").then(token => {
  //     setIsAuth(!!token);
  //   });
  // }, []);

  // if (isAuth === null) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(student-tabs)" />
      <Stack.Screen name="teacher" />
    </Stack>
  );
}
