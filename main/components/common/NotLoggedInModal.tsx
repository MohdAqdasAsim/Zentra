// components/NotLoggedInModal.tsx
import React from "react";
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import { useRouter } from "expo-router";
import FancyText from "./FancyText";

interface Props {
  visible: boolean;
  onCancel: () => void;
}

const NotLoggedInModal: React.FC<Props> = ({ visible, onCancel }) => {
  const router = useRouter();
  const { theme } = useTheme();
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <LinearGradient
              colors={[Colors[theme].gradientStart, Colors[theme].gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-4/5 p-6 rounded-3xl items-center overflow-hidden"
            >
              <Feather name="log-in" size={40} color="white" className="mb-4" />
              <FancyText className="text-white text-xl font-semibold text-center mb-2">
                You’re not logged in
              </FancyText>
              <FancyText className="text-white/70 text-base text-center mb-4">
                Please log in to use this feature.
              </FancyText>

              <TouchableOpacity
                onPress={() => router.push("/auth/login")}
                className="bg-white/20 border border-white/30 px-6 py-3 rounded-xl"
              >
                <FancyText className="text-white font-semibold text-base">
                  Log In
                </FancyText>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default NotLoggedInModal;
