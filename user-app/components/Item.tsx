import { Link } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";


export default function Item({ item }) {
  return (
    <Link href={`/items/${item._id}`} asChild> 
      <Pressable className="bg-white rounded-xl shadow p-1 m-1 mb-4 w-[150]">
        <View className="w-full h-40 rounded-lg overflow-hidden bg-gray-200 mb-2">
          <Image
            source={{ uri: item.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <Text className="text-lg font-semibold text-gray-900">{item.name}</Text>
        <Text className="text-green-700 font-bold mt-1">Ksh {item.price}</Text>
        <Text className="text-gray-500 mt-1">
          Size: <Text className="font-semibold">{item.size}</Text>
        </Text>

          <View
            className={`px-2 py-1 rounded-full flex items-center justify-center ${
              item.available ? "bg-green-200" : "bg-red-200"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                item.available ? "text-green-900" : "text-red-900"
              }`}
            >
              {item.available ? "Available" : "Sold Out"}
            </Text>
          </View>
        
      </Pressable>
    </Link>
  );
}
