import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GradientWrapperProps {
  children: ReactNode;
}

const GradientWrapper: React.FC<GradientWrapperProps> = ({ children }) => {
  const { theme } = useTheme();
  return (
    <LinearGradient
      colors={[Colors[theme].gradientStart, Colors[theme].gradientEnd]}
      className="w-full h-full p-4 pb-0"
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <SafeAreaView className="flex-1">{children}</SafeAreaView>
    </LinearGradient>
  );
};

export default GradientWrapper;
