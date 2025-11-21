import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadHistory = async () => {
    setLoading(true);
    const history = await AsyncStorage.getItem("@order_history");
    setOrders(history ? JSON.parse(history) : []);
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  const clearHistory = async () => {
    await AsyncStorage.removeItem("@order_history");
    setOrders([]);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  if (loading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary pt-10 px-3">

      {/* Header */}
      <View className="bg-white p-4 rounded-lg flex-row justify-between items-center shadow">
        <Text className="text-2xl font-bold">Order History</Text>

        {orders.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <Text className="text-red-600 font-semibold">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Empty History */}
      {orders.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Feather name="archive" size={100} color="white" />
          <Text className="text-xl text-white mt-3">No orders yet</Text>

          <TouchableOpacity
            onPress={() => router.push("/")}
            className="mt-6 bg-white p-4 rounded-lg"
          >
            <Text className="text-primary font-bold text-center">Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView className="mt-4" contentContainerStyle={{ paddingBottom: 50 }}>
          {orders.map((order, index) => (
            <View
              key={order.id}
              className="bg-white p-4 rounded-lg mb-4 shadow"
            >
              <Text className="text-lg font-bold mb-1">Order #{index + 1}</Text>
              <Text className="text-gray-600 mb-2">{formatDate(order.date)}</Text>

              {order.items.map((item: any, i: number) => (
                <Text key={i} className="text-base">
                  • {item.name} ({item.size}) - Ksh {item.price}
                </Text>
              ))}

              <Text className="font-bold text-green-700 mt-2">Total: Ksh {order.total}</Text>
              <Text className="mt-2 text-gray-600">Name: {order.name}</Text>
              <Text className="text-gray-600">Phone: {order.phone}</Text>
              <Text className="text-gray-600">Location: {order.location}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
