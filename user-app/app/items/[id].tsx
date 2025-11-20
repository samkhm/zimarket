import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  Animated,
} from "react-native";
import API from "@/services/api";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ItemDetails() {
  const { id } = useLocalSearchParams(); // get /items/[id]

  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = new Animated.Value(0);

  const fetchItem = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/catalog/getOneItem/${id}`);
      setItem(res.data);

      // fade-in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

    } catch (err) {
      console.log("Error loading item:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItem();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  if (!item) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <Text className="text-white">Item not found</Text>
        <Text className="text-white">Call: 0114303482 fro more info</Text>
      </View>
    );
  }

  return (
    
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ScrollView
        className="flex-1 bg-gray-100"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with Back Button */}
        <View className="flex-row items-center p-4 bg-white shadow">
          <Pressable onPress={() => router.back()} className="p-1 mr-2">
            <Icon name="arrow-back" size={26} color="black" />
          </Pressable>
          <Text className="text-xl font-bold">Item Details</Text>
        </View>

        {/* Image */}
        <Image
          source={{ uri: item.image }}
          className="w-full h-96"
          resizeMode="cover"
        />

        {/* Content */}
        <View className="p-5">

          <Text className="text-3xl font-bold text-gray-900">{item.name}</Text>

          <Text className="text-2xl text-green-700 font-bold mt-3">
            Ksh {item.price}
          </Text>

          <Text className="text-lg text-gray-600 mt-2">
            Size: <Text className="font-semibold">{item.size}</Text>
          </Text>

          {/* Availability */}
          <View
            className={`px-3 py-1 rounded-full self-start mt-4 ${
              item.available ? "bg-green-200" : "bg-red-200"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                item.available ? "text-green-900" : "text-red-900"
              }`}
            >
              {item.available ? "Available" : "Sold Out"}
            </Text>
          </View>

        </View>
      </ScrollView>
    </Animated.View>
  );
}
