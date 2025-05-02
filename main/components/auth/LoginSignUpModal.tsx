// components/LoginSignUpModal.tsx
import React from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the close icon
import FancyText from "../common/FancyText";

interface LoginSignUpModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogin: () => void;
  handleSignUp: () => void;
  handleCloseModal: () => void;
}

const LoginSignUpModal: React.FC<LoginSignUpModalProps> = ({
  modalVisible,
  setModalVisible,
  handleLogin,
  handleSignUp,
  handleCloseModal,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCloseModal} // Close modal on back press
    >
      <TouchableWithoutFeedback onPress={handleCloseModal}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            {/* Modal container with blur and gradient */}
            <LinearGradient
              colors={["#a4c8ff", "#8c6ef5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-4/5 p-6 bg-opacity-70 rounded-3xl items-center shadow-lg overflow-hidden"
            >
              <View className="absolute top-5 right-4">
                {/* Close button using Ionicons */}
                <TouchableOpacity onPress={handleCloseModal}>
                  <Ionicons
                    name="close-circle"
                    size={30}
                    color="#ffffff"
                    style={{ opacity: 0.8 }}
                  />
                </TouchableOpacity>
              </View>
              <FancyText className="text-2xl font-bold mb-5 text-white">
                Choose an Option
              </FancyText>

              {/* Login Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleLogin}
                className="w-full p-4 mb-4 rounded-3xl items-center bg-indigo-500 shadow-md"
              >
                <FancyText className="text-white text-lg">Login</FancyText>
              </TouchableOpacity>

              {/* Sign Up Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSignUp}
                className="w-full p-4 mb-4 rounded-3xl items-center bg-indigo-500 shadow-md"
              >
                <FancyText className="text-white text-lg">Sign Up</FancyText>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LoginSignUpModal;
