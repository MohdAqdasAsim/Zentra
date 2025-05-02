import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { FancyText, ToolboxPageWrapper } from "@/components";
import { getGeminiResponse } from "@/services/gemini";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import {
  deleteThought,
  fetchUserThoughts,
  saveThoughtToFirestore,
} from "@/services/firebaseFunctions";

// Function to wrap input with context for Gemini API
const wrapWithPrompt = (input: string) => {
  return `
    You are a supportive mental wellness assistant. A user has shared the following negative thought:
    "${input}"
    Your task is to provide three gentle, thought-provoking **self-reflection questions** that can guide the user toward reframing the thought.
    Focus on cognitive reframing techniques. Avoid offering direct advice or rewriting the thought. Your goal is to help the user explore their beliefs and arrive at a healthier perspective **themselves**.
    Please return exactly three questions, each on a new line. Add numbers before each question
  `;
};

interface Thought {
  id: string;
  negativeThought: string;
  guidance: string;
  reframedThought: string;
}

const Reframe = () => {
  const { theme } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [negativeThought, setNegativeThought] = useState("");
  const [reframedThought, setReframedThought] = useState("");
  const [guidance, setGuidance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedThoughts, setSavedThoughts] = useState<Thought[]>([]);

  // Function to open the modal
  const openModal = () => {
    setNegativeThought("");
    setReframedThought("");
    setGuidance(null);
    setIsModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Function to generate cognitive reframe guidance
  const generateGuidance = async () => {
    if (negativeThought) {
      setIsLoading(true);
      setGuidance(null); // Clear previous guidance
      try {
        const wrappedInput = wrapWithPrompt(negativeThought);
        const aiResponse = await getGeminiResponse(wrappedInput);
        setGuidance(aiResponse);
      } catch (error) {
        setGuidance("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setGuidance("Please enter a negative thought to get started.");
    }
  };

  const handleSave = async () => {
    if (!negativeThought || !guidance || !reframedThought) return;

    setIsSaving(true);
    const success = await saveThoughtToFirestore(
      negativeThought,
      guidance,
      reframedThought
    );

    if (success) {
      setIsSaving(false);
      closeModal();
    } else {
      setIsSaving(false);
      console.log("Failed to save thought");
    }
  };

  const fetchThoughts = async () => {
    try {
      const thoughts = await fetchUserThoughts();
      setSavedThoughts(thoughts.data as Thought[]);
    } catch (error) {
      console.log("Error fetching thoughts:", error);
    }
  };

  // Fetch saved thoughts when component mounts
  useEffect(() => {
    fetchThoughts();
  }, [isSaving]);

  const handleDeleteThought = async (thoughtId: string) => {
    const success = await deleteThought(thoughtId);
    if (success) {
      setSavedThoughts((prev) =>
        prev.filter((thought) => thought.id !== thoughtId)
      );
    }
  };

  return (
    <ToolboxPageWrapper title="Cognitive Reframe">
      <View className="flex-1 flex items-center justify-center gap-2">
        <TouchableOpacity
          onPress={openModal}
          className="w-24 h-24 rounded-full items-center justify-center flex border-2"
          style={{
            backgroundColor: Colors[theme].tabBar,
            borderColor: Colors[theme].tabIcon,
          }}
        >
          <Feather name="play" size={36} color={Colors[theme].tabIcon} />
        </TouchableOpacity>
        <View className="">
          <FancyText
            className="text-3xl font-semibold text-center"
            style={{ color: Colors[theme].tabIcon }}
          >
            Start Cognitive Reframe
          </FancyText>
          <FancyText
            className="text-base mt-2 text-center"
            style={{ color: Colors[theme].tabIcon }}
          >
            Transform negative or unhelpful thoughts into balanced, constructive
            ones. This guided exercise helps you reflect, reframe, and shift
            your mindset with compassion and clarity.
          </FancyText>
        </View>
        <BlurView
          intensity={80}
          className="w-full p-4 mt-6 rounded-2xl overflow-hidden"
        >
          <FancyText
            className="text-xl font-semibold text-center mb-4"
            style={{ color: Colors[theme].tabIcon }}
          >
            Saved Thoughts
          </FancyText>

          <ScrollView className="w-full">
            {savedThoughts.length > 0 ? (
              savedThoughts.map((thought, index) => (
                <View
                  key={index}
                  className="p-2 mb-2 rounded-lg flex flex-row items-center justify-between"
                  style={{ backgroundColor: Colors[theme].primary }}
                >
                  <FancyText className="text-white text-base">
                    {thought.reframedThought}
                  </FancyText>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      handleDeleteThought(thought.id);
                    }}
                  >
                    <Feather name="trash-2" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <FancyText
                className="text-center text-[14px] opacity-70"
                style={{ color: Colors[theme].text }}
              >
                No thoughts saved yet.
              </FancyText>
            )}
          </ScrollView>
        </BlurView>
      </View>

      {/* Modal for Cognitive Reframe */}
      <Modal
        visible={isModalVisible}
        onRequestClose={closeModal}
        transparent={true}
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <BlurView
            intensity={10}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View
                className="w-5/6 p-6 rounded-xl shadow-xl"
                style={{ backgroundColor: Colors[theme].primary }}
              >
                <FancyText className="text-2xl font-bold text-center mb-4 text-white">
                  Cognitive Reframe
                </FancyText>

                <FancyText className="text-base text-center text-gray-200 mb-4">
                  Think of a recent negative thought you’ve had. What is
                  something that you believe about yourself, others, or a
                  situation that may not be entirely true?
                </FancyText>

                <TextInput
                  className="h-12 border border-gray-300 rounded-lg p-3 mb-4 text-white placeholder:text-white"
                  placeholder="Enter negative thought"
                  value={negativeThought}
                  onChangeText={setNegativeThought}
                  multiline
                />

                <TouchableOpacity
                  onPress={generateGuidance}
                  className="bg-white px-4 py-2 rounded-lg mb-4"
                >
                  <FancyText
                    className="text-center"
                    style={{ color: Colors[theme].tabIcon }}
                  >
                    Get Guidance
                  </FancyText>
                </TouchableOpacity>

                {isLoading && (
                  <FancyText className="text-center text-gray-300 mb-4">
                    Thinking...
                  </FancyText>
                )}

                {guidance && (
                  <ScrollView className="mb-4">
                    <FancyText className="text-gray-200 text-sm">
                      {guidance}
                    </FancyText>
                  </ScrollView>
                )}

                <TextInput
                  className="h-12 border border-gray-300 rounded-lg p-3 mb-4 text-white placeholder:text-white"
                  placeholder="Reframe your thought"
                  value={reframedThought}
                  onChangeText={setReframedThought}
                  multiline
                />

                <View className="flex-row justify-between">
                  <TouchableOpacity
                    onPress={handleSave}
                    className="px-4 py-2 rounded-lg bg-white"
                  >
                    {isSaving ? (
                      <ActivityIndicator color={Colors[theme].primary} />
                    ) : (
                      <FancyText
                        className="text-white text-center"
                        style={{ color: Colors[theme].primary }}
                      >
                        Save Thought
                      </FancyText>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={closeModal}
                    className="px-4 py-2 rounded-lg bg-white"
                  >
                    <FancyText
                      className="text-white text-center"
                      style={{ color: Colors[theme].primary }}
                    >
                      Close
                    </FancyText>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </BlurView>
        </TouchableWithoutFeedback>
      </Modal>
    </ToolboxPageWrapper>
  );
};

export default Reframe;
