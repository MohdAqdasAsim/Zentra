import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import React, { ReactNode, useEffect } from "react";
import { StatusBar, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FancyText from "./FancyText";

interface ToolboxPageWrapperProps {
  children: ReactNode;
  title: string;
}

const ToolboxPageWrapper: React.FC<ToolboxPageWrapperProps> = ({
  children,
  title,
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <LinearGradient
      colors={[Colors[theme].gradientStart, Colors[theme].gradientEnd]}
      className="w-full h-full p-4"
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center px-2 py-1">
          <TouchableOpacity onPress={() => router.back()} className="p-2 mr-3">
            <Feather
              name="arrow-left"
              size={24}
              color={Colors[theme].tabIcon}
            />
          </TouchableOpacity>

          {title && (
            <FancyText
              className="text-2xl font-semibold"
              style={{ color: Colors[theme].tabIcon }}
            >
              {title}
            </FancyText>
          )}
        </View>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ToolboxPageWrapper;
