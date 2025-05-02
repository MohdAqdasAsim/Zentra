import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import FancyText from "./FancyText";

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  confirmFancyText?: string;
  cancelFancyText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmFancyText = "Delete",
  cancelFancyText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <TouchableWithoutFeedback>
            <LinearGradient
              colors={[Colors[theme].gradientStart, Colors[theme].gradientEnd]}
              className="w-full max-w-md p-6 rounded-3xl items-center overflow-hidden"
            >
              <Ionicons
                name="alert-circle-outline"
                size={50}
                color="white"
                style={{ marginBottom: 12 }}
              />
              <FancyText className="text-white text-xl font-bold mb-2 text-center">
                {title}
              </FancyText>
              <FancyText className="text-white text-base text-center opacity-80 mb-6">
                {message}
              </FancyText>

              <View className="flex-row space-x-4 gap-4">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onCancel}
                  className="px-6 py-2 rounded-full bg-white/20 border border-white/40"
                >
                  <FancyText className="text-white text-base">
                    {cancelFancyText}
                  </FancyText>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onConfirm}
                  className="px-6 py-2 rounded-full bg-red-600/80"
                >
                  <FancyText className="text-white text-base">
                    {confirmFancyText}
                  </FancyText>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConfirmModal;
