import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  DiscardChangesModal,
  FancyText,
  FieldEmptyModal,
  GradientWrapper,
  SaveModal,
} from "@/components";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  saveJournalEntry,
  fetchJournalById,
  updateJournalEntry,
} from "@/services/firebaseFunctions";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import moment from "moment";
import { useFocusEffect } from "expo-router";
import { BackHandler } from "react-native";
import { useNetwork } from "@/contexts/NetworkProvider";

const JournalPage = () => {
  const router = useRouter();
  const { isConnected } = useNetwork();
  const { theme } = useTheme();
  const { journalId } = useLocalSearchParams<{ journalId?: string }>();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [initialTitle, setInitialTitle] = useState<string>("");
  const [initialContent, setInitialContent] = useState<string>("");

  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const [fieldEmptyModal, setFieldEmptyModal] = useState(false);

  const formattedDate = moment().format("dddd, MMMM Do YYYY");

  const hasUnsavedChanges =
    title !== initialTitle || content !== initialContent;

  useEffect(() => {
    if (journalId) {
      fetchJournalById(journalId).then((res) => {
        if (res.success && res.data) {
          setTitle(res.data.title);
          setContent(res.data.content);
          setInitialTitle(res.data.title); // 🧠 store initial data
          setInitialContent(res.data.content);
        } else {
          Alert.alert("Error", res.message || "Could not load journal.");
        }
      });
    }
  }, [journalId]);

  const handleSaveJournal = async (auto = false) => {
    if (!title.trim() || !content.trim()) {
      if (!auto) {
        setFieldEmptyModal(true);
        setTimeout(() => setFieldEmptyModal(false), 1500);
      }
      return;
    }

    const mood = theme;
    let result;

    if (journalId) {
      result = await updateJournalEntry(journalId, {
        title,
        content,
        mood,
      });
    } else {
      result = await saveJournalEntry(title, content, mood);
    }

    if (result.success) {
      setInitialTitle(title); // ✅ Update initial after save
      setInitialContent(content);
      if (!auto) {
        setSaveModal(true);
        setTimeout(() => setSaveModal(false), 1500);
      }
    } else {
      if (!auto) {
        Alert.alert("Error", result.message || "Save failed.");
      }
    }
  };

  // ⏱️ Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      handleSaveJournal(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [title, content]);

  // 🔙 Handle back button
  const handleBackPress = () => {
    if (hasUnsavedChanges) {
      setShowDiscardModal(true);
    } else {
      router.back();
    }
  };

  // Optional: Block Android hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [title, content, initialTitle, initialContent])
  );

  return (
    <GradientWrapper>
      <View className="flex-row items-center justify-between px-2 py-1">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBackPress}
          className="p-2 mr-3"
        >
          <Feather name="arrow-left" size={24} color={Colors[theme].tabIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleSaveJournal()}
          className="p-2 mr-3"
        >
          <Feather name="save" size={24} color={Colors[theme].tabIcon} />
        </TouchableOpacity>
      </View>

      {/* Journal Body */}
      <View className="flex-1 p-4 rounded-lg">
        {/* Date */}
        <FancyText
          className="text-lg mb-2 opacity-80"
          style={{ color: Colors[theme].text }}
        >
          {formattedDate}
        </FancyText>

        {/* Title Input */}
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={Colors[theme].text}
          className="font-bold text-2xl mb-4 bg-transparent border-b border-white/20"
          style={{ color: Colors[theme].text }}
        />

        {/* Content Input */}
        <ScrollView className="flex-1">
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Write your thoughts here..."
            placeholderTextColor={Colors[theme].text}
            multiline
            className="flex-1 w-full text-white text-xl bg-transparent"
            style={{ color: Colors[theme].text }}
          />
        </ScrollView>

        {/* Character Count */}
        <FancyText
          className="text-right text-white text-sm opacity-60 mt-2"
          style={{ color: Colors[theme].text }}
        >
          {content.length} characters
        </FancyText>
      </View>

      <DiscardChangesModal
        visible={showDiscardModal}
        onCancel={() => setShowDiscardModal(false)}
        onDiscard={() => {
          setShowDiscardModal(false);
          router.back();
        }}
      />

      <SaveModal
        visible={saveModal}
        onClose={() => setSaveModal(false)}
        message={journalId ? "Journal updated!" : "Journal saved!"}
      />

      <FieldEmptyModal
        visible={fieldEmptyModal}
        onClose={() => setFieldEmptyModal(false)}
        message={"Title and content cannot be empty."}
      />
    </GradientWrapper>
  );
};

export default JournalPage;
