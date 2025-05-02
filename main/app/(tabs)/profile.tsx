import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import {
  getUserProfile,
  logout,
  updateUserProfile,
} from "@/services/firebaseFunctions";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import {
  ConfirmModal,
  FancyText,
  GradientWrapper,
  NoInternetModal,
  SaveModal,
} from "@/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { useFont } from "@/contexts/FontProvider";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useNetwork } from "@/contexts/NetworkProvider";
import { useAuth } from "@/contexts/AuthProvider";

interface UserProfile {
  name?: string;
  email?: string;
  profileImage?: string;
  age?: number;
  pronouns?: string;
  tonePreference?: string;
  emotionalReason?: string;
  checkInFrequency?: string;
  preferredTime?: string;
  avoidTopics?: string;
  plan?: string;
}

export default function Profile() {
  const { isConnected } = useNetwork();
  const { theme } = useTheme();
  const { isLoggedIn } = useAuth();
  const { isFontEnabled, toggleFont } = useFont();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isSavedModalVisible, setIsSavedModalVisible] = useState(false);
  const [isConnectedToInternetModal, setIsConnectedToInternetModal] =
    useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();
        if (data) {
          setProfile(data);
          setEditedProfile(data);
        }
        await AsyncStorage.setItem("userProfile", JSON.stringify(data));
      } catch (error) {
        console.warn("Online fetch failed. Attempting cache...");
        const cached = await AsyncStorage.getItem("userProfile");
        if (cached) {
          const parsed = JSON.parse(cached);
          setProfile(parsed);
          setEditedProfile(parsed);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    setActionLoading(true);
    await logout();
    setActionLoading(false);
    router.replace("/auth/login");
  };

  const handleSave = async () => {
    try {
      setActionLoading(true);
      await updateUserProfile(editedProfile);
      setIsSavedModalVisible(true);
      setProfile(editedProfile);
      setActionLoading(false);
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <GradientWrapper>
        <ActivityIndicator size="large" color="#fff" />
      </GradientWrapper>
    );
  }

  if (!profile) {
    return (
      <GradientWrapper>
        {isLoggedIn ? (
          <>
            <View className="flex flex-row justify-between items-center px-2 mb-2">
              <FancyText className="text-2xl text-white">Profile</FancyText>
              <TouchableOpacity
                onPress={
                  isConnected
                    ? handleLogout
                    : () => setIsConnectedToInternetModal(true)
                }
              >
                <Feather name="log-out" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <View className="flex flex-row justify-between items-center px-2 mt-4">
              <FancyText className="text-white text-center text-lg">
                No profile data found.
              </FancyText>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/auth/profile-setup")}
                className="px-4 py-2 bg-white rounded-2xl"
              >
                <FancyText style={{ color: Colors[theme].primary }}>
                  Create Profile
                </FancyText>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View className="flex-1 items-center justify-center px-4">
            <Feather name="log-in" size={40} color="white" className="mb-4" />
            <FancyText className="text-white text-xl font-semibold text-center mb-2">
              You’re not logged in
            </FancyText>
            <FancyText className="text-white/70 text-base text-center mb-4">
              Please log in.
            </FancyText>

            <TouchableOpacity
              onPress={() => router.push("/auth/login")}
              className="bg-white/20 border border-white/30 px-6 py-3 rounded-xl"
            >
              <FancyText className="text-white font-semibold text-base">
                Log In
              </FancyText>
            </TouchableOpacity>
          </View>
        )}
      </GradientWrapper>
    );
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.6,
    });

    if (!result.canceled && result.assets?.[0]?.base64) {
      setEditedProfile({
        ...editedProfile,
        profileImage: `data:image/jpeg;base64,${result.assets[0].base64}`,
      });
    }
  };

  return (
    <GradientWrapper>
      {actionLoading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 z-50 justify-center items-center pointer-events-none">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <ScrollView
        contentContainerStyle={{ padding: 12, paddingBottom: 72 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Edit Toggle Button */}
        <View className="flex flex-row justify-between items-center px-2 mb-2">
          <FancyText className="text-2xl" style={{ color: Colors[theme].text }}>
            Profile
          </FancyText>
          <View className="flex flex-row gap-4">
            <TouchableOpacity
              onPress={
                isConnected
                  ? () => setIsEditing((prev) => !prev)
                  : () => setIsConnectedToInternetModal(true)
              }
            >
              <Feather
                name={isEditing ? "x" : "edit-3"}
                size={16}
                color={Colors[theme].text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={
                isConnected
                  ? isEditing
                    ? handleSave
                    : () => setConfirmVisible(true)
                  : () => setIsConnectedToInternetModal(true)
              }
            >
              <Feather
                name={isEditing ? "save" : "log-out"}
                size={16}
                color={Colors[theme].text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Header */}
        <BlurView
          intensity={90}
          className="flex-row items-center mb-4 rounded-3xl overflow-hidden px-4 py-2"
        >
          <TouchableOpacity
            disabled={!isEditing}
            onPress={pickImage}
            className="w-20 h-20 rounded-full overflow-hidden"
          >
            {editedProfile.profileImage ? (
              <Image
                source={{ uri: editedProfile.profileImage }}
                className="w-20 h-20"
                resizeMode="cover"
              />
            ) : (
              <View
                className="w-20 h-20 justify-center items-center"
                style={{ backgroundColor: Colors[theme].tabBar }}
              >
                <Feather name="user" size={34} color={Colors[theme].tabIcon} />
              </View>
            )}
          </TouchableOpacity>
          <View className="ml-4 flex w-full">
            <TextInput
              editable={isEditing}
              placeholder="Name"
              value={editedProfile.name || ""}
              onChangeText={(text: any) =>
                setEditedProfile({ ...editedProfile, name: text })
              }
              className="text-2xl font-bold"
              style={{ color: Colors[theme].text }}
              placeholderTextColor="#ccc"
            />
            <FancyText
              className="text-sm"
              style={{ color: Colors[theme].text }}
            >
              {profile.email}
            </FancyText>
          </View>
        </BlurView>

        {/* Personal Info */}
        <View className="flex-row gap-3 mb-3">
          <BlurView
            intensity={90}
            className="p-3 rounded-2xl flex-1 overflow-hidden"
          >
            <FancyText
              className="text-white mb-1"
              style={{ color: Colors[theme].text }}
            >
              Age
            </FancyText>
            <TextInput
              editable={isEditing}
              keyboardType="numeric"
              placeholder="Age"
              value={editedProfile.age?.toString() || ""}
              onChangeText={(text) =>
                setEditedProfile({
                  ...editedProfile,
                  age: Number(text) || undefined,
                })
              }
              style={{ color: Colors[theme].text }}
              className={`text-white px-3 py-2 rounded-xl ${
                isEditing ? "bg-white/10" : ""
              }`}
              placeholderTextColor="#ccc"
            />
          </BlurView>
          <BlurView
            intensity={90}
            className="p-3 rounded-2xl flex-1 overflow-hidden"
          >
            <FancyText
              className="text-white mb-1"
              style={{ color: Colors[theme].text }}
            >
              Pronouns
            </FancyText>
            <TextInput
              editable={isEditing}
              placeholder="Pronouns"
              value={editedProfile.pronouns || ""}
              onChangeText={(text) =>
                setEditedProfile({ ...editedProfile, pronouns: text })
              }
              style={{ color: Colors[theme].text }}
              className={`text-white placeholder:text-white px-3 py-2 rounded-xl ${
                isEditing ? "bg-white/10" : ""
              }`}
              placeholderTextColor="#ccc"
            />
          </BlurView>
        </View>

        {/* Emotional Preferences */}
        <BlurView
          intensity={90}
          className="p-4 rounded-2xl mb-3 overflow-hidden"
        >
          <FancyText
            className="text-white mb-1"
            style={{ color: Colors[theme].text }}
          >
            Tone Preference
          </FancyText>
          <TextInput
            editable={isEditing}
            placeholder="e.g., Friendly, Supportive"
            value={editedProfile.tonePreference || ""}
            onChangeText={(text) =>
              setEditedProfile({ ...editedProfile, tonePreference: text })
            }
            style={{ color: Colors[theme].text }}
            className={`text-white placeholder:text-white px-3 py-2 rounded-xl ${
              isEditing ? "bg-white/10" : ""
            } mb-3`}
            placeholderTextColor="#ccc"
          />
          <FancyText
            className="text-white mb-1"
            style={{ color: Colors[theme].text }}
          >
            Why you're here
          </FancyText>
          <TextInput
            editable={isEditing}
            placeholder="e.g., Stress relief, journaling"
            value={
              editedProfile.emotionalReason || "To help me control my emotions"
            }
            onChangeText={(text) =>
              setEditedProfile({ ...editedProfile, emotionalReason: text })
            }
            style={{ color: Colors[theme].text }}
            className={`text-white px-3 py-2 rounded-xl ${
              isEditing ? "bg-white/10" : ""
            }`}
            placeholderTextColor="#ccc"
          />
        </BlurView>

        {/* App Preferences */}
        <View className="flex-row gap-3 mb-3">
          {/* Check-in Frequency */}
          <BlurView
            intensity={90}
            className="p-3 rounded-2xl flex-1 overflow-hidden"
          >
            <FancyText
              className="text-white mb-1"
              style={{ color: Colors[theme].text }}
            >
              Check-in Frequency
            </FancyText>
            {isEditing ? (
              <Picker
                selectedValue={editedProfile.checkInFrequency ?? undefined}
                onValueChange={(value) =>
                  setEditedProfile({
                    ...editedProfile,
                    checkInFrequency: value,
                  })
                }
                style={{
                  color: Colors[theme].text,
                  backgroundColor: "#ffffff10",
                  borderRadius: 12,
                }}
                dropdownIconColor={Colors[theme].text}
              >
                <Picker.Item label="Select frequency..." value={undefined} />
                <Picker.Item label="Daily" value="daily" />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Only when I ask" value="manual" />
                <Picker.Item label="Never" value="never" />
              </Picker>
            ) : (
              <FancyText
                className="text-white uppercase px-3 py-2 rounded-xl"
                style={{ color: Colors[theme].text }}
              >
                {editedProfile.checkInFrequency || "Not set"}
              </FancyText>
            )}
          </BlurView>

          {/* Preferred Time */}
          <BlurView
            intensity={90}
            className="p-3 rounded-2xl flex-1 overflow-hidden"
          >
            <FancyText
              className="text-white mb-1"
              style={{ color: Colors[theme].text }}
            >
              Preferred Time
            </FancyText>
            {isEditing ? (
              <Picker
                selectedValue={editedProfile.preferredTime ?? undefined}
                onValueChange={(value) =>
                  setEditedProfile({ ...editedProfile, preferredTime: value })
                }
                style={{
                  color: Colors[theme].text,
                  backgroundColor: "#ffffff10",
                  borderRadius: 12,
                }}
                dropdownIconColor={Colors[theme].text}
              >
                <Picker.Item label="Select time..." value={undefined} />
                <Picker.Item label="Morning" value="morning" />
                <Picker.Item label="Afternoon" value="afternoon" />
                <Picker.Item label="Evening" value="evening" />
                <Picker.Item label="Night" value="night" />
                <Picker.Item label="Late night" value="late-night" />
              </Picker>
            ) : (
              <FancyText
                className="text-white uppercase px-3 py-2 rounded-xl"
                style={{ color: Colors[theme].text }}
              >
                {editedProfile.preferredTime || "Not set"}
              </FancyText>
            )}
          </BlurView>
        </View>

        {/* Avoid Topics */}
        <BlurView
          intensity={90}
          className="p-4 rounded-2xl mb-3 overflow-hidden"
        >
          <FancyText
            className="text-white mb-1"
            style={{ color: Colors[theme].text }}
          >
            Topics to Avoid
          </FancyText>
          <TextInput
            editable={isEditing}
            placeholder="e.g., Trauma, Work"
            value={editedProfile.avoidTopics || "Past Trauma"}
            onChangeText={(text) =>
              setEditedProfile({ ...editedProfile, avoidTopics: text })
            }
            style={{ color: Colors[theme].text }}
            className={`text-white px-3 py-2 rounded-xl ${
              isEditing ? "bg-white/10" : ""
            }`}
            placeholderTextColor="#ccc"
          />
        </BlurView>

        {/* Plan */}
        <BlurView
          intensity={90}
          className="p-2 py-3 rounded-2xl mb-3 overflow-hidden"
        >
          <FancyText
            className="text-white mb-1 font-bold"
            style={{ color: Colors[theme].text }}
          >
            Currently you are on free plan
          </FancyText>
        </BlurView>

        <View className="w-full flex flex-row items-center justify-between pl-2 mb-2">
          <FancyText
            className="text-white text-base font-bold"
            style={{ color: Colors[theme].text }}
          >
            Fancy Font
          </FancyText>

          <TouchableOpacity
            className={`w-16 h-8 px-1 flex justify-center ${
              isFontEnabled ? "items-end" : "items-start"
            } bg-white/40 rounded-3xl`}
            onPress={toggleFont}
            activeOpacity={0.9}
          >
            <View className="w-6 h-6 bg-white rounded-full shadow-md" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SaveModal
        visible={isSavedModalVisible}
        onClose={() => setIsSavedModalVisible(false)}
        message={"Profile updated!"}
      />

      <NoInternetModal
        visible={isConnectedToInternetModal}
        onCancel={() => setIsConnectedToInternetModal(false)}
      />

      <ConfirmModal
        visible={confirmVisible}
        onConfirm={handleLogout}
        onCancel={() => setConfirmVisible(false)}
        title="Log Out?"
        message="Are you sure you want to log out?"
        confirmFancyText="Log Out"
        cancelFancyText="Cancel"
      />
    </GradientWrapper>
  );
}
