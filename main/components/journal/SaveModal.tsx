import React, { useEffect } from "react";
import { Modal, View, TouchableWithoutFeedback } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeProvider";
import { Colors } from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import FancyText from "../common/FancyText";

interface Props {
  visible: boolean;
  onClose: () => void;
  message?: string;
}

const SaveModal: React.FC<Props> = ({ visible, onClose, message }) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <LinearGradient
            colors={[Colors[theme].gradientStart, Colors[theme].gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-4/5 p-6 rounded-3xl items-center overflow-hidden"
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={50}
              color="white"
              style={{ marginBottom: 12 }}
            />

            <FancyText className="text-white text-xl font-bold mb-2">
              Success
            </FancyText>
            <FancyText className="text-white text-center text-base opacity-90">
              {message || "Your journal was saved successfully."}
            </FancyText>
          </LinearGradient>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SaveModal;
