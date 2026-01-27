// import { View,Text,Button } from "react-native";
// //import AttendanceButton from "@/components/AttendanceButton";a
// export default function AttendanceScreen(){
//     return(
//         <View style={{flex: 1,alignItems: 'center',justifyContent: 'center'}}>
//             <Text>Mark Attendance</Text>
//             <Button title="Check In" onPress={()=>{}} />
//         </View>
//     );
// }


import { View, Text, Button, Alert } from "react-native";
import API from "@/constants/api";
import { getCurrentLocation } from "@/hooks/useGeofence";

export default function AttendanceScreen() {

  const markAttendance = async () => {
    const location = await getCurrentLocation();
    try {

      const response = await API.post("/attendance/mark", {
        userId: "USER_ID",
        latitude: location.latitude,
        longitude: location.longitude,
      });

      Alert.alert(
        "Attendance Result",
        `${response.data.message}\nStatus: ${response.data.status}`
      );
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not mark attendance");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'pink'}}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Geo-Fence Attendance
      </Text>
      <Button title="Mark Attendance" onPress={markAttendance} />
      
    </View>
  );
}