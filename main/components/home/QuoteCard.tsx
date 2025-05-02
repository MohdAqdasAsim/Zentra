import React, { useState } from "react";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import { TouchableOpacity } from "react-native";
import { quotes } from "@/constants/Quotes";
import FancyText from "../common/FancyText";

const QuoteCard = () => {
  const { theme } = useTheme();
  const [quoteIndex, setQuoteIndex] = useState(0);

  return (
    <BlurView
      intensity={50}
      tint="light"
      className="w-full flex-1 rounded-3xl mb-20 mt-4 px-6 py-4 overflow-hidden justify-center items-start"
    >
      <FancyText
        className="text-primary text-[14px] font-semibold mb-2"
        style={{ color: Colors[theme].text }}
      >
        💬 Quote of the Day
      </FancyText>
      <FancyText
        className="text-secondary text-[14px]"
        style={{ color: Colors[theme].text }}
      >
        {quotes[quoteIndex]}
      </FancyText>
      <TouchableOpacity
        onPress={() => setQuoteIndex((quoteIndex + 1) % quotes.length)}
        className="mt-2 self-start bg-white/40 px-3 py-1 rounded-xl"
      >
        <FancyText
          className="text-white text-[12px]"
          style={{ color: Colors[theme].text }}
        >
          New Quote
        </FancyText>
      </TouchableOpacity>
    </BlurView>
  );
};

export default QuoteCard;
