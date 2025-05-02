import React from "react";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import { dailyFocus } from "@/constants/DailyFocus";
import FancyText from "../common/FancyText";

const DailyFocusCard = () => {
  const { theme } = useTheme();

  const dayOfMonth = new Date().getDate();

  const dailyFocusFancyText = dailyFocus[dayOfMonth % dailyFocus.length];

  return (
    <BlurView
      intensity={50}
      tint="light"
      className="w-full rounded-3xl mt-4 px-6 py-4 overflow-hidden justify-center items-start"
    >
      <FancyText
        className="text-primary text-[14px] font-semibold mb-2"
        style={{ color: Colors[theme].text }}
      >
        🌱 Daily Focus
      </FancyText>
      <FancyText
        className="text-secondary text-[14px] italic"
        style={{ color: Colors[theme].text }}
      >
        {dailyFocusFancyText}
      </FancyText>
    </BlurView>
  );
};

export default DailyFocusCard;
