import { View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";
import { Theme, useTheme } from "@/contexts/ThemeProvider";
import FancyText from "../common/FancyText";
import { useAlert } from "@/contexts/AlertProvider";

const emotionIcons = [
  { id: "joy", source: require("@/assets/icons/emoticons/joy.png") },
  { id: "serenity", source: require("@/assets/icons/emoticons/calm.png") },
  { id: "tension", source: require("@/assets/icons/emoticons/anxiety.png") },
  { id: "sorrow", source: require("@/assets/icons/emoticons/sad.png") },
  { id: "fury", source: require("@/assets/icons/emoticons/anger.png") },
  { id: "haze", source: require("@/assets/icons/emoticons/confusion.png") },
];

const MoodPicker = () => {
  const { setTheme, theme } = useTheme();
  const showAlert = useAlert();

  return (
    <BlurView
      intensity={50}
      tint="light"
      className="w-full h-32 rounded-3xl overflow-hidden flex justify-center items-center"
    >
      <FancyText
        className="text-[14px] mb-4 text-center"
        style={{ color: Colors[theme].text }}
      >
        Tap an icon to change your theme based on your current mood
      </FancyText>
      <View className="flex-row justify-between w-[90%]">
        {emotionIcons.map((emotion) => (
          <TouchableOpacity
            key={emotion.id}
            activeOpacity={0.7}
            className="items-center justify-center"
            onPress={() => {
              setTheme(emotion.id as Theme);
              setTimeout(() => {
                showAlert("info", `Theme changed to ${emotion.id}`);
              }, 200);
            }}
          >
            <View className="w-10 h-10 rounded-full bg-white/30 items-center justify-center">
              <Image
                source={emotion.source}
                className="w-8 h-8"
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </BlurView>
  );
};

export default MoodPicker;
