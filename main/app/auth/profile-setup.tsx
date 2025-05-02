import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Switch,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { saveUserProfile } from "@/services/firebaseFunctions";
import { BackgroundWrapper, FancyText } from "@/components";
import { BlurView } from "expo-blur";
import { Entypo } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { Theme, useTheme } from "@/contexts/ThemeProvider";
import { useFont } from "@/contexts/FontProvider";

const steps = [0, 1, 2, 3, 4];

type PlanType = "free" | "premium";

interface ProfileForm {
  name: string;
  age: string; // Keep as string for input, convert to number before submit
  profileImage: string;
  pronouns: string;
  tonePreference: string;
  emotionalReason: string;
  checkInFrequency: string;
  preferredTime: string;
  avoidTopics: string;
  plan: PlanType;
}

const ProfileSetup = () => {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    age: "",
    profileImage: "",
    pronouns: "",
    tonePreference: "",
    emotionalReason: "",
    checkInFrequency: "",
    preferredTime: "",
    avoidTopics: "",
    plan: "free",
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [moodTheme, setMoodTheme] = useState<Theme>("joy");
  const [ambientSounds, setAmbientSounds] = useState<boolean>(false);
  const { isFontEnabled, toggleFont } = useFont();

  const { setTheme, setAmbientSounds: setAmbientSoundInContext } = useTheme();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.6,
    });

    if (!result.canceled && result.assets?.[0]?.base64) {
      setForm({
        ...form,
        profileImage: `data:image/jpeg;base64,${result.assets[0].base64}`,
      });
    }
  };

  const validateStep = (): boolean => {
    try {
      if (stepIndex === 0) {
        if (!form.name.trim()) {
          setFeedback("Name is required");
          return false;
        }
        const ageNumber = Number(form.age);
        if (!ageNumber || isNaN(ageNumber) || ageNumber < 1) {
          setFeedback("Please enter a valid age");
          return false;
        }
      }

      if (stepIndex === 2) {
        if (!form.emotionalReason.trim()) {
          setFeedback("Please share why you're here");
          return false;
        }
        if (!form.avoidTopics.trim()) {
          setFeedback("Please share what you want to avoid");
          return false;
        }
      }

      if (stepIndex === 3) {
        if (!form.checkInFrequency) {
          setFeedback("Please select a check-in frequency");
          return false;
        }
        if (!form.preferredTime) {
          setFeedback("Please select a support time");
          return false;
        }
      }

      if (stepIndex === 4 && !moodTheme) {
        setFeedback("Please choose a mood theme");
        return false;
      }

      return true;
    } catch (err: any) {
      Alert.alert("Error in validateStep", err?.message || JSON.stringify(err));
      return false;
    }
  };

  const handleNext = () => {
    try {
      if (!validateStep()) return;
      setFeedback("");
      if (stepIndex < steps.length - 1) {
        setStepIndex(stepIndex + 1);
      } else {
        handleProfileSubmit();
      }
    } catch (err: any) {
      Alert.alert("Error in handleNext", err?.message || JSON.stringify(err));
    }
  };

  const handleBack = () => {
    setFeedback("");
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const handleProfileSubmit = async () => {
    if (!form.name) {
      setFeedback("Name is required.");
    }

    const ageNumber = Number(form.age);
    if (!ageNumber || isNaN(ageNumber) || ageNumber < 0) {
      setFeedback("Please enter a valid age.");
    }

    const profileData = {
      ...form,
      age: ageNumber,
      plan: "free" as const,
    };

    setLoading(true);
    const { success, message } = await saveUserProfile(profileData);
    setFeedback(message);
    setLoading(false);

    setTheme(moodTheme);
    setAmbientSoundInContext(ambientSounds);

    if (success) {
      router.replace("/home");
    }
  };

  const renderInputs = () => {
    try {
      switch (stepIndex) {
        case 0:
          return (
            <View className="flex flex-col items-center justify-center gap-4">
              <View className="flex items-center">
                {form.profileImage ? (
                  <View className="relative">
                    <Image
                      source={{ uri: form.profileImage }}
                      className="w-24 h-24 rounded-full bg-gray-300"
                    />
                    <Pressable
                      onPress={() => setForm({ ...form, profileImage: "" })}
                      className="absolute top-0 right-0 bg-white rounded-full p-1"
                    >
                      <Entypo name="cross" size={18} color="black" />
                    </Pressable>
                  </View>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={pickImage}
                    className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-300 opacity-70"
                  >
                    <Entypo name="camera" size={34} color="white" />
                  </TouchableOpacity>
                )}
                <FancyText className="text-xs text-gray-500 mt-1">
                  Add/Change Photo
                </FancyText>
              </View>

              <View className="w-full px-3 mt-4">
                <FancyText className="text-[14px] text-[#523c72]">
                  What should we call you?
                </FancyText>
                <TextInput
                  value={form.name}
                  onChangeText={(text) => setForm({ ...form, name: text })}
                  placeholder="Your name"
                  className="border-b border-[#523c72] text-[#523c72] mb-4 w-full text-lg"
                />

                <FancyText className="text-[14px] text-[#523c72]">
                  How old are you?
                </FancyText>
                <TextInput
                  value={form.age || ""}
                  onChangeText={(text) => setForm({ ...form, age: text })}
                  placeholder="e.g., 22"
                  keyboardType="numeric"
                  maxLength={3}
                  className="border-b border-[#523c72] text-[#523c72] mb-4 w-full text-lg"
                />
              </View>
            </View>
          );
        case 1:
          return (
            <>
              <FancyText className="text-[14px] text-[#523c72]">
                Your pronouns (optional):
              </FancyText>
              <TextInput
                value={form.pronouns}
                onChangeText={(text) => setForm({ ...form, pronouns: text })}
                placeholder="e.g., she/her, he/him"
                className="border-b border-[#523c72] text-[#523c72] mb-4 w-full text-lg"
              />
              <FancyText className="text-[14px] text-[#523c72]">
                Preferred tone from Serava:
              </FancyText>
              <TextInput
                value={form.tonePreference}
                onChangeText={(text) =>
                  setForm({ ...form, tonePreference: text })
                }
                placeholder="gentle, poetic, funny..."
                className="border-b border-[#523c72] text-[#523c72] mb-4 w-full text-lg"
              />
            </>
          );
        case 2:
          return (
            <>
              <FancyText className="text-[14px] text-[#523c72]">
                What brings you here?
              </FancyText>
              <TextInput
                value={form.emotionalReason}
                onChangeText={(text) =>
                  setForm({ ...form, emotionalReason: text })
                }
                placeholder="e.g., anxiety, self-growth"
                className="border-b border-[#523c72] text-[#523c72] mb-4 w-full text-lg"
              />
              <FancyText className="text-[14px] text-[#523c72]">
                Topics you'd like to avoid?
              </FancyText>
              <TextInput
                value={form.avoidTopics}
                onChangeText={(text) => setForm({ ...form, avoidTopics: text })}
                placeholder="grief, trauma, etc."
                className="border-b border-[#523c72] text-[#523c72] mb-4 w-full text-lg"
              />
            </>
          );
        case 3:
          return (
            <>
              <FancyText className="text-[14px] text-[#523c72]">
                How often for check-ins?
              </FancyText>
              <Picker
                selectedValue={form.checkInFrequency}
                onValueChange={(value) =>
                  setForm({ ...form, checkInFrequency: value })
                }
              >
                <Picker.Item label="Select frequency..." value={null} />
                <Picker.Item label="Daily" value="daily" />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Only when I ask" value="manual" />
                <Picker.Item label="Never" value="never" />
              </Picker>

              <FancyText className="text-[14px] text-[#523c72]">
                Preferred support time?
              </FancyText>
              <Picker
                selectedValue={form.preferredTime}
                onValueChange={(value) =>
                  setForm({ ...form, preferredTime: value })
                }
              >
                <Picker.Item label="Select time..." value={null} />
                <Picker.Item label="Morning" value="morning" />
                <Picker.Item label="Afternoon" value="afternoon" />
                <Picker.Item label="Evening" value="evening" />
                <Picker.Item label="Night" value="night" />
                <Picker.Item label="Late night" value="late-night" />
              </Picker>
            </>
          );
        case 4:
          return (
            <>
              <FancyText className="text-[14px] text-[#523c72]">
                Mood theme to begin with:
              </FancyText>
              <Picker
                selectedValue={moodTheme}
                onValueChange={(value) => setMoodTheme(value)}
              >
                <Picker.Item label="Select a mood theme..." value={null} />
                <Picker.Item label="Joy 🌞" value="joy" />
                <Picker.Item label="Serenity 🌿" value="serenity" />
                <Picker.Item label="Tension ⚡" value="tension" />
                <Picker.Item label="Sorrow 🌧️" value="sorrow" />
                <Picker.Item label="Fury 🔥" value="fury" />
                <Picker.Item label="Haze 🌫️" value="haze" />
              </Picker>

              <View className="flex-row items-center justify-between mt-4">
                <FancyText className="text-lg text-[#523c72]">
                  Enable fancy font?
                </FancyText>
                <Switch value={ambientSounds} onValueChange={toggleFont} />
              </View>
            </>
          );
        default:
          return <FancyText>Nothing to show</FancyText>;
      }
    } catch (err: any) {
      Alert.alert(
        "Error rendering inputs",
        err?.message || JSON.stringify(err)
      );
      return (
        <FancyText className="text-red-500">Something went wrong.</FancyText>
      );
    }
  };

  return (
    <BackgroundWrapper>
      <View className="w-full flex items-center mb-12">
        <Image
          source={require("@/assets/images/icon.png")}
          className="w-20 h-20"
          resizeMode="contain"
        />
      </View>

      <BlurView
        intensity={70}
        tint="light"
        className="w-full rounded-3xl overflow-hidden p-4 max-w-md"
      >
        {renderInputs()}

        {/* Feedback */}
        {feedback && (
          <FancyText className="text-center text-[#312170]">
            {feedback}
          </FancyText>
        )}

        <View className="flex-row justify-between mt-6">
          {stepIndex > 0 && (
            <Pressable
              onPress={handleBack}
              className="bg-gray-300 py-3 px-6 rounded-2xl"
            >
              <FancyText className="text-gray-800 text-center text-[14px]">
                Back
              </FancyText>
            </Pressable>
          )}

          <Pressable
            onPress={handleNext}
            className="bg-[#9486f0] py-3 px-6 rounded-2xl ml-auto"
            disabled={loading}
          >
            <FancyText className="text-white text-center text-[14px]">
              {loading
                ? "Saving..."
                : stepIndex === steps.length - 1
                ? "Finish Setup"
                : "Continue"}
            </FancyText>
          </Pressable>
        </View>
      </BlurView>
    </BackgroundWrapper>
  );
};

export default ProfileSetup;
