import React, { useState } from "react";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useNetwork } from "@/contexts/NetworkProvider";
import NoInternetModal from "../common/NoInternetModal";
import { useAuth } from "@/contexts/AuthProvider";
import NotLoggedInModal from "../common/NotLoggedInModal";
import FancyText from "../common/FancyText";

const JournalCard = () => {
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
        ✍️ Journal
      </FancyText>
      <FancyText
        style={{ color: Colors[theme].text }}
        className="text-secondary text-[14px] mb-2"
      >
        You haven’t written today. Want to capture how you feel?
      </FancyText>
      <TouchableOpacity
        className="bg-white/40 px-3 py-1 rounded-xl self-start"
        onPress={
          isConnected
            ? isLoggedIn
              ? () => router.push("/journal/journal")
              : () => setIsLoggedInModal(true)
            : () => setIsConnectedToInternetModal(true)
        }
      >
        <FancyText
          className="text-white text-[12px]"
          style={{ color: Colors[theme].text }}
        >
          Start Journaling
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

export default JournalCard;
