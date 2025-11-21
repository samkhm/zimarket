import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Linking from "expo-linking";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const router = useRouter();

  const showToast = (msg: string) => {
    if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
    else Alert.alert("", msg);
  };

  const loadCart = async () => {
    const data = await AsyncStorage.getItem("@menu_items");
    setItems(data ? JSON.parse(data) : []);
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadCart();
    }, [])
  );

  const removeItem = async (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    await AsyncStorage.setItem("@menu_items", JSON.stringify(updated));
    setItems(updated);
    showToast("Item removed");
  };

  const clearCart = async () => {
    await AsyncStorage.removeItem("@menu_items");
    setItems([]);
    showToast("Cart cleared");
  };

  const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const submitOrder = async () => {
    if (!name || !phone || !location) {
      return Alert.alert("Missing Info", "Please fill all fields.");
    }

    if (items.length === 0) {
      return Alert.alert("Cart Empty", "Add items to your cart first.");
    }

    const orderEntry = {
      id: Date.now(),
      items,
      total,
      name,
      phone,
      location,
      date: new Date().toISOString(),
    };

    try {
      // Save to order history
      const history = await AsyncStorage.getItem("@order_history");
      const parsed = history ? JSON.parse(history) : [];
      parsed.push(orderEntry);
      await AsyncStorage.setItem("@order_history", JSON.stringify(parsed));

      // Send WhatsApp message
      const adminNumber = "254114303482"; // replace with your admin number

      const itemDetails = items
        .map((item) => `• ${item.name} (${item.size}) - Ksh ${item.price}`)
        .join("\n");

       

      const message = `
🛒 *NEW ORDER*

👤 Name: ${name}
📞 Phone: ${phone}
📍 Location: ${location}

------------------
${itemDetails}
------------------

💰 *TOTAL:* Ksh ${total}
      `;

      const url =
        "https://wa.me/" + adminNumber + "?text=" + encodeURIComponent(message);

      await Linking.openURL(url);

      // Clear cart
      await AsyncStorage.removeItem("@menu_items");
      setItems([]);
      setModalVisible(false);
      setName("");
      setPhone("");
      setLocation("");
      showToast("Order submitted!");
    } catch (error) {
      console.log("Order submission error:", error);
      Alert.alert("Error", "Failed to save order. Try again.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary pt-10">

      {/* Header */}
      <View className="bg-white p-4 rounded-lg shadow flex-row justify-between items-center">
        <Text className="text-2xl font-bold">My Cart</Text>

        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text className="text-red-600 font-semibold">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Total & WhatsApp Order at the top */}
      {items.length > 0 && (
        <View className="bg-white p-4 rounded-lg shadow my-3 mx-3">
          <Text className="text-xl font-bold mb-2">Total: Ksh {total}</Text>

          <TouchableOpacity
            className="bg-green-600 p-4 rounded-lg"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-white text-center text-lg font-bold">
              Place Order via WhatsApp
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty Cart */}
      {items.length === 0 ? (
        <View className="flex-1 justify-center items-center px-5">
          <Icon name="shopping-cart" size={100} color="white" />
          <Text className="text-xl text-white mt-3">Your cart is empty</Text>

          <TouchableOpacity
            onPress={() => router.push("/")}
            className="mt-6 bg-white p-4 rounded-lg"
          >
            <Text className="text-primary text-lg font-bold text-center">Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView className="mt-2 px-3" contentContainerStyle={{ paddingBottom: 50 }}>
          {items.map((item, index) => (
            <View
              key={index}
              className="bg-white p-4 rounded-lg mb-3 shadow flex-row justify-between items-center"
            >
              <View>
                <Text className="text-lg font-bold">{item.name}</Text>
                <Text className="text-gray-600">Size: {item.size}</Text>
                <Text className="text-green-700 font-semibold text-lg">
                  Ksh {item.price}
                </Text>
              </View>

              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Icon name="delete" size={28} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modal Form */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center items-center px-5">
          <View className="bg-white w-full p-6 rounded-lg">

            <Text className="text-2xl font-bold mb-4 text-center">
              Enter Your Information
            </Text>

            <TextInput
              placeholder="Full Name"
              className="border p-3 rounded mb-3"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              className="border p-3 rounded mb-3"
              value={phone}
              onChangeText={setPhone}
            />

            <TextInput
              placeholder="Location / Delivery Address"
              className="border p-3 rounded mb-3"
              value={location}
              onChangeText={setLocation}
            />

            <TouchableOpacity
              className="bg-green-600 p-4 rounded-lg mt-2"
              onPress={submitOrder}
            >
              <Text className="text-white text-center text-lg font-bold">
                Submit Order via WhatsApp
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-4"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-center text-red-600 font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}
