import React, { useState } from "react";
import { StatusBar, ImageBackground, Pressable, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FancyText, LoginSignUpModal, SlidesFlatList } from "@/components";

const OnBoarding = () => {
  const router = useRouter();

  // State to control modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  const handleContinuePress = () => {
    setModalVisible(true); // Show the modal when continue is pressed
  };

  const handleLogin = () => {
    setModalVisible(false); // Close the modal
    router.push("/auth/login"); // Navigate to the login screen
  };

  const handleSignUp = () => {
    setModalVisible(false); // Close the modal
    router.push("/auth/signup"); // Navigate to the signup screen
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Close the modal when clicking outside
    Keyboard.dismiss(); // Dismiss keyboard if it's open
  };

  return (
    <ImageBackground
      source={require("@/assets/images/main.png")}
      resizeMode="cover"
      className="flex-1 w-full h-full"
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <SafeAreaView className="flex-1 items-center justify-center pt-12 pb-24">
        <SlidesFlatList />

        {/* Continue Button */}
        <LinearGradient
          colors={["#b6a8ff", "#9486f0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-3xl w-1/2 h-12 overflow-hidden"
        >
          <Pressable
            android_ripple={{ color: "#d3cfff" }}
            className="w-full h-full flex items-center justify-center"
            onPress={handleContinuePress} // Show modal on press
          >
            <FancyText className="text-2xl text-white text-center">
              Continue
            </FancyText>
          </Pressable>
        </LinearGradient>

        {/* Login/SignUp Modal */}
        <LoginSignUpModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          handleLogin={handleLogin}
          handleSignUp={handleSignUp}
          handleCloseModal={handleCloseModal}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default OnBoarding;
