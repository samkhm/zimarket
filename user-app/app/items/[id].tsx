import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  Animated,
  TouchableOpacity,  
  ToastAndroid,
  Platform
} from "react-native";
import API from "@/services/api";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ItemDetails() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // FIX: Use useRef so animation value persists
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showToast = (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert("", msg);
    }
  };

   const fetchItem = async () => {
    try {
      setLoading(true);

      // If you created /getOneItem/:id backend route, use this:
      const res = await API.get(`/catalog/getOneItem/${id}`); 
      setItem(res.data);

      // Reset animation before running
      fadeAnim.setValue(0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

    } catch (err) {
      console.log("Error loading item:", err);
      setItem(null);
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


// Add item to cart
const addCart = async () => {
  try {
    console.log("Name:", item.name);
    console.log("Price:", item.price);
    console.log("Size:", item.size);
    console.log("Available:", item.available);
    setCartLoading(true);

  } catch (error) {
    showToast("Failed adding to cart!");
    console.log("Cart error:", error);
    
  } finally{
    setCartLoading(false);
  }

}

  // Loading screen
  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  // Item not found screen
  if (!item) {
    return (
      <View className="flex-1 items-center justify-center bg-primary p-4">
        <Text className="text-white text-xl mb-2">Item not found</Text>
        <Text className="text-white text-base">Call: 0114303482 for more info</Text>

        <Pressable
          onPress={() => router.back()}
          className="mt-5 px-5 py-2 bg-white rounded-lg"
        >
          <Text className="text-primary font-bold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }} className="bg-primary p-5 pb-10">
            <ScrollView
              className="flex-1 bg-gray-100 rounded top-5"
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
                          {/* Header */}
                          <View className="flex-row items-center p-4 bg-white shadow">
                            <Pressable onPress={() => router.back()} className="p-1 mr-2">
                              <Icon name="arrow-back" size={26} color="black" />
                            </Pressable>
                            <Text className="text-xl font-bold">Item Details</Text>
                          </View>

                          {/* Image */}
                          <View className="p-2 rounded bg-primary">

                          <Image
                            source={{ uri: item.image }}
                            className="w-full h-96 bg-gray-200"
                            resizeMode="cover"
                          />
                          </View>

                          {/* Item Content */}
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
                            <View className="p-5 items-center justify-center top-10">
                              <TouchableOpacity 
                                 onPress={addCart}
                                 className="bg-green-500 p-5 w-3/4 rounded items-center justify-center">
                                <Text className="text-white text-xl">{cartLoading ? <ActivityIndicator size="small" color="yellow"/> : "Add to Cart"}</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
            </ScrollView>
    </Animated.View>
  );
}
