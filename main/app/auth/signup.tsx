import React, { useState } from "react";
import {
  View,
  Image,
  TextInput,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BackgroundWrapper, EmailSentModal, FancyText } from "@/components";
import { useRouter } from "expo-router";
import { signUp } from "@/services/firebaseFunctions";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async () => {
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setFeedback("Please enter a valid email!");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setFeedback("Password do not match");
      return;
    }

    // Check if password is strong enough (optional)
    if (password.length < 6) {
      setFeedback("Password should be at least 6 characters long!");
      return;
    }

    try {
      setLoading(true);

      const { success, message } = await signUp(email, password);

      setLoading(false);

      if (success) {
        setModalVisible(true);
      } else {
        setFeedback(message);
      }
    } catch (error) {
      setFeedback("Something went wrong. Please try again.");
    }
  };

  const handleOkButton = () => {
    setModalVisible(false);
  };

  return (
    <BackgroundWrapper>
      {/* Logo */}
      <View className="w-full flex items-center mb-4">
        <Image
          source={require("@/assets/images/icon.png")}
          className="w-20 h-20"
          resizeMode="contain"
        />
      </View>

      {/* Header FancyText */}
      <View className="w-full flex items-center mb-6">
        <FancyText className="text-[#312170] font-semibold text-5xl">
          Welcome! 🌱
        </FancyText>
        <FancyText className="text-[#312170] text-2xl mt-2 text-center">
          Let's start your journey to a calmer mind 💜
        </FancyText>
      </View>

      {/* Inputs Container */}
      <View
        className="w-full h-80 rounded-3xl overflow-hidden mb-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderColor: "rgba(255, 255, 255, 0.3)",
          borderWidth: 1,
        }}
      >
        <BlurView
          intensity={50}
          tint="light"
          className="flex-1 items-center justify-center px-6 py-6"
        >
          {/* Email */}
          <FancyText className="self-start text-gray-700 text-base mb-1">
            Email
          </FancyText>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="white"
            className="w-full text-[#312170] placeholder:text-gray-300 text-xl bg-white/10 rounded-xl px-4 py-2 mb-4"
          />

          {/* Password */}
          <FancyText className="self-start text-gray-700 text-base mb-1">
            Password
          </FancyText>
          <View className="w-full flex-row items-center bg-white/10 rounded-xl px-4 py-2">
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="white"
              className="flex-1 text-[#312170] placeholder:text-gray-300 text-xl"
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Entypo
                name={showPassword ? "eye-with-line" : "eye"}
                size={22}
                color="#312170"
              />
            </Pressable>
          </View>

          {/* Confirm Password */}
          <FancyText className="self-start text-gray-700 text-base mb-1">
            Confirm Password
          </FancyText>
          <View className="w-full flex-row items-center bg-white/10 rounded-xl px-4 py-2">
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="white"
              className="flex-1 text-[#312170] placeholder:text-gray-300 text-xl"
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Entypo
                name={showPassword ? "eye-with-line" : "eye"}
                size={22}
                color="#312170"
              />
            </Pressable>
          </View>
        </BlurView>
      </View>

      {/* Feedback */}
      {feedback && (
        <FancyText className="text-center mb-2 text-[#312170]">
          {feedback}
        </FancyText>
      )}

      {/* Sign Up Button */}
      <LinearGradient
        colors={["#b6a8ff", "#9486f0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl w-full h-12 overflow-hidden"
      >
        <Pressable
          android_ripple={{ color: "#d3cfff" }}
          className="w-full h-full flex items-center justify-center"
          onPress={handleSignUp}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <FancyText className="text-2xl text-white text-center">
              Signup
            </FancyText>
          )}
        </Pressable>
      </LinearGradient>

      {/* Already Have an Account? Login Link */}
      <View className="w-full flex flex-row items-center justify-center mt-6">
        <FancyText className="text-[#312170cb]">
          Already have an account?{" "}
        </FancyText>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            router.replace("/auth/login");
          }}
        >
          <FancyText className="text-[#312170]">Log In</FancyText>
        </TouchableOpacity>
      </View>

      {/* Email Sent Modal */}
      <EmailSentModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleOk={handleOkButton}
      />
    </BackgroundWrapper>
  );
};

export default Signup;
