// components/DiscardChangesModal.tsx
import React from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import FancyText from "../common/FancyText";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onDiscard: () => void;
}

const DiscardChangesModal: React.FC<Props> = ({
  visible,
  onCancel,
  onDiscard,
}) => {
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
              <View className="absolute top-5 right-4">
                <TouchableOpacity onPress={onCancel}>
                  <Ionicons
                    name="close-circle"
                    size={30}
                    color="#ffffff"
                    style={{ opacity: 0.8 }}
                  />
                </TouchableOpacity>
              </View>

              <FancyText className="text-xl font-bold text-white mb-5">
                Unsaved Changes
              </FancyText>
              <FancyText className="text-white text-base mb-6 text-center">
                You have unsaved changes. Are you sure you want to discard them?
              </FancyText>

              <TouchableOpacity
                onPress={onDiscard}
                className="w-full bg-white/30 p-3 rounded-2xl mb-3 items-center"
              >
                <FancyText className="text-white font-medium">
                  Discard Changes
                </FancyText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onCancel}
                className="w-full bg-white/20 p-3 rounded-2xl items-center"
              >
                <FancyText className="text-white font-medium">Cancel</FancyText>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DiscardChangesModal;
