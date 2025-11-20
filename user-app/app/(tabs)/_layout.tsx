import { images } from '@/constants/images';
import { Tabs } from 'expo-router';
import React from 'react';
import { ImageBackground, Text, View } from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';

export default function _layout() {

      const TabIcon = ({ focused, IconComponent, title }) => {
        if (focused) {
          return (
            <ImageBackground
              source={images.highlight}
              className="flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
            >
              <IconComponent size={20} color="#151312" />

              <Text className="text-secondary text-base font-semibold ml-2">{title}</Text>
            </ImageBackground>
          );
        }

        return (
          <View className="size-full justify-center items-center mt-4 rounded-full">
            <IconComponent size={20} color="#A8B5DB" />
          </View>
        );
      };

      return (
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarItemStyle: {
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            },
            tabBarStyle: {
              backgroundColor: '#0f0d23',
              borderRadius: 50,
              marginHorizontal: 20,
              marginBottom: 36,
              height: 52,
              position: 'absolute',
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: '#0f0d23',
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  focused={focused}
                  IconComponent={(props) => <Entypo name="home" {...props} />}
                  title="Home"
                />
              ),
            }}
          />

          <Tabs.Screen
            name="cart"
            options={{
              title: 'Cart',
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  focused={focused}
                  IconComponent={(props) => <Feather name="shopping-cart" {...props} />}
                  title="Cart"
                />
              ),
            }}
          />
        </Tabs>
      );
}
