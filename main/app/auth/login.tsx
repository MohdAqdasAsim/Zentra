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
import {
  BackgroundWrapper,
  FancyText,
  ForgotPasswordModal,
} from "@/components";
import { useRouter } from "expo-router";
import { checkUserProfileExists, logIn } from "@/services/firebaseFunctions";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [forgotModalVisible, setForgotModalVisible] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setFeedback(null);

    const result = await logIn(email.trim(), password);

    setLoading(false);
    setFeedback(result.message);

    if (result.success && result.isUserEmailVerified) {
      const hasProfile = await checkUserProfileExists();
      if (hasProfile) {
        router.replace("/home");
      } else {
        router.replace("/auth/profile-setup");
      }
    }
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
        <FancyText className="text-[#312170] font-semibold text-4xl">
          Hey there 👋
        </FancyText>
        <FancyText className="text-[#312170] text-lg mt-2 text-center">
          We've missed you. Let’s pick up where we left off 💜
        </FancyText>
      </View>

      {/* Inputs Container */}
      <View
        className="w-full h-60 rounded-3xl overflow-hidden mb-4"
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
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Enter your email"
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
              className="flex-1 text-[#312170] placeholder:text-gray-300 text-xl"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Entypo
                name={showPassword ? "eye-with-line" : "eye"}
                size={22}
                color="#312170"
              />
            </Pressable>
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setForgotModalVisible(true)}
            className="w-full flex items-end"
          >
            <FancyText className="text-[#312170]">Forgot Password?</FancyText>
          </TouchableOpacity>
        </BlurView>
      </View>

      {/* Feedback */}
      {feedback && (
        <FancyText className="text-center mb-2 text-[#312170]">
          {feedback}
        </FancyText>
      )}

      {/* Login Button */}
      <LinearGradient
        colors={["#b6a8ff", "#9486f0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl w-full h-12 overflow-hidden"
      >
        <Pressable
          android_ripple={{ color: "#d3cfff" }}
          className="w-full h-full flex items-center justify-center"
          onPress={handleLogin}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <FancyText className="text-2xl text-white text-center">
              Login
            </FancyText>
          )}
        </Pressable>
      </LinearGradient>

      {/* Already Have an Account? Sign Up Link */}
      <View className="w-full flex flex-row items-center justify-center mt-6">
        <FancyText className="text-[#312170cb]">
          Don't have an account?{" "}
        </FancyText>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            router.replace("/auth/signup");
          }}
        >
          <FancyText className="text-[#312170]">Sign Up</FancyText>
        </TouchableOpacity>
      </View>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        visible={forgotModalVisible}
        onClose={() => setForgotModalVisible(false)}
        setFeedback={setFeedback}
      />
    </BackgroundWrapper>
  );
};

export default Login;
