import { View, Text, FlatList } from "react-native";
import API from "@/constants/api";
import { useEffect, useState } from "react";


 type Attendance ={
    _id: string;
    date: string;
    status: string;
  }
export default function History() {
  const [data, setData] = useState<Attendance[]>([]);
  const USER_ID ="696b6137a5681dd2839e2a83";
  
  useEffect(() => {
    //alert("useefet is running");
    API.get(`/attendance/history/${USER_ID}`)
      .then((res) => {
        console.log("History :",res.data);
        setData(res.data);
      })
      .catch(err => {
        console.log("error",err.message);
      });
  }, []);

  return (
    <View style={{flex: 1,justifyContent:"center",alignItems:"center",backgroundColor:'white'}}>
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>History UI</Text>
          <Text style={{ fontSize: 16 }}>{new Date(item.date).toDateString()}</Text>
          <Text style={{ fontSize: 16 }}>Status: {item.status}</Text>
        </View>
      )}
    />
    </View>
  );
}