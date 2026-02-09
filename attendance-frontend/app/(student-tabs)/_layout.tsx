import { Tabs ,router } from 'expo-router';
import { useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

//import { HapticTab } from '@/components/haptic-tab';
// import { IconSymbol } from '@/components/ui/icon-symbol';
// import { Colors } from '@/constants/theme';
// import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  //const colorScheme = useColorScheme();
  useEffect(() => {
    AsyncStorage.getItem("token").then(token => {
      if (!token) {
        router.replace("/login");
      }
    });
  }, []);

  return (
    <Tabs
      screenOptions={{
       // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false
        //tabBarButton: HapticTab,
       }}
       >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
         // tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
         // tabBarIcon: ({ color }) => <IconSymbol size={28} name="checkmark.seal.fill" color={color} />,
        }}
      />
      <Tabs.Screen name="history" options={{title :"History"}} />
      
      {/* <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
         // tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      /> */}
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        //  tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
