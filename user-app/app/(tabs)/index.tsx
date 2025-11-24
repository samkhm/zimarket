import Item from "@/components/Item";
import API from "@/services/api";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Animated, FlatList, Text, View } from "react-native";

export default function Catalog() {
  const CHUNK_SIZE = 10;

  const [allItems, setAllItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all items from API
  const fetchItems = async () => {
    try {
      setLoadingInitial(true);

      const res = await API.get("/catalog/getItemsForUsers");
      const itemsFromAPI = res.data || [];

      // Ensure deleted items are removed (extra safety)
      const filteredItems = itemsFromAPI.filter(item => !item.deleted);

      setAllItems(filteredItems);

      // Replace displayedItems with new array to force FlatList re-render
      setDisplayedItems([...filteredItems.slice(0, CHUNK_SIZE)]);
      setHasMore(filteredItems.length > CHUNK_SIZE);
    } catch (error) {
      console.log("Error fetching items:", error);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Infinite scroll
  const loadMoreItems = () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    const currentLength = displayedItems.length;
    const nextChunk = allItems.slice(currentLength, currentLength + CHUNK_SIZE);

    if (nextChunk.length === 0) {
      setHasMore(false);
      setLoadingMore(false);
      return;
    }

    // Always create a new array to force FlatList re-render
    setDisplayedItems(prev => [...prev, ...nextChunk]);
    setLoadingMore(false);
  };

  // Pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  // Animated item rendering
  const renderAnimatedItem = ({ item, index }) => {
    const fade = new Animated.Value(0);
    const scale = new Animated.Value(0.8);

    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 300, delay: index * 50, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 8, useNativeDriver: true })
    ]).start();

    return (
      <Animated.View style={{ opacity: fade, transform: [{ scale }] }}>
        <Item item={item} />
      </Animated.View>
    );
  };

  return (
    <View className="bg-primary flex-1 p-5">

      {/* HEADER */}
      <View className="w-full flex items-center justify-center p-5">
        <Text className="text-2xl text-white font-bold border-b-2 border-white p-2">
          Zimark Shop
        </Text>
      </View>

      {/* ITEMS GRID */}
      <View className="bg-gray-100 flex-1 rounded p-2">

        <FlatList
          key={displayedItems.length} // changing key forces full reset when items change
          data={displayedItems}
          keyExtractor={(item) => item._id}
          renderItem={renderAnimatedItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreItems}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          extraData={displayedItems} // ensures re-render when items change
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}

          ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="#000" /> : null}

          ListEmptyComponent={
            !loadingInitial && (
              <View className="flex-1 items-center justify-center mt-10">
                <Text className="text-lg text-gray-400 italic">
                  No items available. Pull to refresh
                </Text>
              </View>
            )
          }
        />

        {loadingInitial && (
          <View className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}

      </View>
    </View>
  );
}
