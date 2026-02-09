// import * as Location from 'expo-location';

// export async function checkGeoFence(lat ,lng){
//     const location =await Location.getCurrentPositionAsync({});
//     return true;
// }

import * as Location from "expo-location";

export const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error('Location permission denied');
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy :Location.Accuracy.High,
  });// myself
  console.log("Student Current Location:",
   location.coords.latitude,
   location.coords.longitude
)
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};