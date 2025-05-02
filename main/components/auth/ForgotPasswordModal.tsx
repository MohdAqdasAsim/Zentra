// components/ForgotPasswordModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { resetPassword } from "@/services/firebaseFunctions";
import FancyText from "../common/FancyText";

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  setFeedback: React.Dispatch<React.SetStateAction<string | null>>;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onClose,
  setFeedback,
}) => {
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!forgotEmail.trim()) {
      Alert.alert("Enter an email");
    }

    setLoading(true);

    // Call the resetPassword function with the entered email
    const result = await resetPassword(forgotEmail.trim());
    setLoading(false);

    if (result.success) {
      setFeedback("Password reset link sent! Please check your email.");
    } else {
      setFeedback(result.message || "Failed to send password reset link.");
    }

    onClose();
  };

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <LinearGradient
            colors={["#a4c8ff", "#8c6ef5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-11/12 p-6 rounded-3xl items-center shadow-lg overflow-hidden"
          >
            <View className="absolute top-5 right-4">
              <TouchableOpacity onPress={onClose}>
                <Ionicons
                  name="close-circle"
                  size={30}
                  color="#ffffff"
                  style={{ opacity: 0.8 }}
                />
              </TouchableOpacity>
            </View>

            <FancyText className="text-2xl font-bold text-white mb-4">
              Reset Password
            </FancyText>

            <TextInput
              value={forgotEmail}
              onChangeText={setForgotEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              className="w-full text-white placeholder:text-white/70 bg-white/20 px-4 py-3 mb-6 rounded-xl"
              placeholderTextColor="#eee"
              autoCapitalize="none"
            />

            <LinearGradient
              colors={["#b6a2ff", "#9424f0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-3xl w-full h-12 overflow-hidden"
            >
              <Pressable
                android_ripple={{ color: "#d3cfff" }}
                className="w-full h-full flex items-center justify-center"
                onPress={handleReset}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <FancyText className="text-2xl text-white text-center">
                    Reset Password
                  </FancyText>
                )}
              </Pressable>
            </LinearGradient>
          </LinearGradient>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ForgotPasswordModal;
