// components/SlidesFlatList.tsx
import React, { useRef, useEffect, useState } from "react";
import { View, FlatList, Dimensions, Image } from "react-native";
import { BlurView } from "expo-blur";
import FancyText from "../common/FancyText";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Welcome to Serava",
    subtitle: "Your Emotional Companion",
    description: "Feeling anxious? Serava will guide you through it.",
    image: require("@/assets/images/icon.png"),
    visual: require("@/assets/icons/hello.png"),
  },
  {
    id: "2",
    title: "Track Your Moods",
    subtitle: "Daily Emotional Insights",
    description: "Understand your patterns and feel seen every day.",
    image: require("@/assets/images/icon.png"),
    visual: require("@/assets/icons/mood.png"),
  },
  {
    id: "3",
    title: "Breathe & Reflect",
    subtitle: "Mindfulness Tools",
    description: "Guided exercises to help you find calm in the chaos.",
    image: require("@/assets/images/icon.png"),
    visual: require("@/assets/icons/breathe.png"),
  },
];

const SlidesFlatList = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => {
          if (item.id === "1") {
            // 🎨 Custom layout for first slide
            return (
              <View
                style={{ width }}
                className="flex-1 items-center justify-center"
              >
                <Image
                  source={item.image}
                  className="w-24 h-24 mb-6"
                  resizeMode="contain"
                />
                <FancyText className="text-[#312170] font-bold text-5xl text-center mb-2">
                  Hello There! 👋
                </FancyText>
                <FancyText className="text-[#312170] text-2xl text-center">
                  Meet Serava, your emotional wellness companion.
                </FancyText>
                <View className="w-full flex-1 px-12 rounded-3xl overflow-hidden my-12">
                  <BlurView
                    intensity={50}
                    tint="light"
                    className="flex-1 items-center justify-center px-6 overflow-hidden rounded-3xl"
                  >
                    <FancyText className="text-[#312170] text-xl text-center">
                      Let’s begin a journey toward calm, clarity, and care 💜
                    </FancyText>
                    <Image
                      source={item.visual}
                      className="w-60 h-60 mb-6"
                      resizeMode="contain"
                    />
                  </BlurView>
                </View>
              </View>
            );
          }

          // 🧱 Default layout
          return (
            <View
              style={{ width }}
              className="flex-1 items-center justify-center"
            >
              <Image
                source={item.image}
                className="w-20 h-20 mb-6"
                resizeMode="contain"
              />
              <FancyText className="text-[#312170] font-medium text-5xl text-center">
                {item.title}
              </FancyText>
              <FancyText className="text-[#312170] text-3xl text-center mt-2">
                {item.subtitle}
              </FancyText>
              <View className="w-full flex-1 px-12 rounded-3xl overflow-hidden my-12">
                <BlurView
                  intensity={50}
                  tint="light"
                  className="flex-1 items-center justify-center px-6 overflow-hidden rounded-3xl"
                >
                  <FancyText className="text-[#312170] text-2xl text-center">
                    {item.description}
                  </FancyText>
                  <Image
                    source={item.visual}
                    className="w-60 h-60 mb-6"
                    resizeMode="contain"
                  />
                </BlurView>
              </View>
            </View>
          );
        }}
      />

      {/* Dots Slider */}
      <View className="flex-row justify-center mb-8">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`w-3 h-3 mx-1 rounded-full ${
              index === currentIndex ? "bg-[#312170]" : "bg-[#ccc]"
            }`}
          />
        ))}
      </View>
    </>
  );
};

export default SlidesFlatList;
