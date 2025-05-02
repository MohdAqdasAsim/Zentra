import React, { useState } from "react";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useNetwork } from "@/contexts/NetworkProvider";
import NoInternetModal from "../common/NoInternetModal";
import NotLoggedInModal from "../common/NotLoggedInModal";
import { useAuth } from "@/contexts/AuthProvider";
import FancyText from "../common/FancyText";

const AiCard = () => {
  const { isConnected } = useNetwork();
  const { isLoggedIn } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [isConnectedToInternetModal, setIsConnectedToInternetModal] =
    useState(false);
  const [isLoggedInModal, setIsLoggedInModal] = useState(false);

  return (
    <BlurView
      intensity={50}
      tint="light"
      className="w-full rounded-3xl mt-4 px-6 py-4 overflow-hidden justify-center items-start"
    >
      <FancyText
        style={{ color: Colors[theme].text }}
        className="text-primary text-[14px] font-semibold mb-2"
      >
        🤖 Talk to Serava
      </FancyText>
      <FancyText
        style={{ color: Colors[theme].text }}
        className="text-secondary text-[14px] mb-2"
      >
        Feeling something? Need someone to talk to? Serava is here to listen.
      </FancyText>
      <TouchableOpacity
        className="bg-white/40 px-3 py-1 rounded-xl self-start"
        onPress={
          isConnected
            ? isLoggedIn
              ? () => router.push("/chat/ai-chat")
              : () => setIsLoggedInModal(true)
            : () => setIsConnectedToInternetModal(true)
        }
      >
        <FancyText
          className="text-white text-[12px]"
          style={{ color: Colors[theme].text }}
        >
          Open Chat
        </FancyText>
      </TouchableOpacity>

      <NoInternetModal
        visible={isConnectedToInternetModal}
        onCancel={() => setIsConnectedToInternetModal(false)}
      />

      <NotLoggedInModal
        visible={isLoggedInModal}
        onCancel={() => setIsLoggedInModal(false)}
      />
    </BlurView>
  );
};

export default AiCard;
