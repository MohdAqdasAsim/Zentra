import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { FancyText, GradientWrapper } from "@/components";
import { useTheme } from "@/contexts/ThemeProvider";
import { Colors } from "@/constants/Colors";
import Markdown from "react-native-markdown-display"; // Import Markdown
import { getGeminiResponse } from "@/services/gemini"; // Assuming you have this service
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fetchConversationById,
  storeConversation,
  updateConversation,
} from "@/services/firebaseFunctions";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

type Message = { from: "user" | "ai"; text: string };

const AiChat = () => {
  const { conversationId } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [conversationTitle, setConversationTitle] = useState("");
  const [isConversationStarted, setIsConversationStarted] = useState(false); // Track conversation start
  const [actionLoading, setActionLoading] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const loadConversation = async () => {
      if (conversationId && typeof conversationId === "string") {
        const result = await fetchConversationById(conversationId);

        const formattedMessages =
          (result.data?.messages as Message[])?.map((msg) => ({
            from: msg.from === "user" ? "user" : "ai", // Map sender to user/ai
            text: msg.text || "No message content", // Fallback if content is undefined
          })) || [];

        if (result.success) {
          setMessages(formattedMessages);
          setConversationTitle("");
          setIsConversationStarted(true); // mark as already started
        } else {
          console.error("Could not load conversation:", result.message);
        }
      }
    };

    loadConversation();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const emotion = theme;

    const promptWrapper = `You are Serava, an emotionally intelligent AI companion designed to provide compassionate, adaptive emotional support.
    The user is sharing their feelings with you, and they are experiencing a specific emotion. Your role is to create a safe, comforting space where they feel heard and understood, without offering solutions unless specifically requested.
  
    Here is the user's input:
    - What the user said: "${input}"
    - Current emotional state: "${emotion}"
  
    Please respond with:
    - A short and clear message unless the user asks for something more elaborate
    - A tone and language that resonates with the user's emotional state (gentle if they're sad, calming if they're anxious, uplifting if they're happy)
    - Genuine empathy that reflects how an emotionally present companion would naturally respond
    - A supportive, non-judgmental approach — just *be there* and acknowledge their feelings
    - If appropriate, gently encourage the user to continue the conversation with a soft prompt, without forcing it
    
    Avoid analyzing, diagnosing, or offering advice. Focus solely on validating their emotions and providing comfort in the moment.
    Begin your response:`;

    try {
      if (!isConversationStarted) {
        // First, get the conversation title from Gemini
        const titleResponse = await getGeminiResponse(
          `Someone says: "${input}" Give a short, emotionally resonant title for this conversation—like a chapter in a heartfelt story. Only reply with the title.`
        );
        setConversationTitle(titleResponse); // Set the title

        // Store the title in AsyncStorage
        await AsyncStorage.setItem("conversationTitle", titleResponse);
      }

      // Get AI's response
      const aiResponse = await getGeminiResponse(promptWrapper);
      setMessages((prev) => [...prev, { from: "ai", text: aiResponse }]);

      // Save the conversation in AsyncStorage (store messages)
      await AsyncStorage.setItem(
        "conversationMessages",
        JSON.stringify([
          ...messages,
          userMessage,
          { from: "ai", text: aiResponse },
        ])
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Error getting response." },
      ]);
    } finally {
      setLoading(false);
    }

    // Mark conversation as started after first message
    if (!isConversationStarted) {
      setIsConversationStarted(true);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    setShowScrollButton(contentOffsetY < 200);
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleBackPress = useCallback(async (): Promise<boolean> => {
    try {
      if (isConversationStarted) {
        const storedTitle = await AsyncStorage.getItem("conversationTitle");
        const storedMessages = await AsyncStorage.getItem(
          "conversationMessages"
        );

        if (storedMessages) {
          setActionLoading(true);
          const parsedMessages = JSON.parse(storedMessages);

          let result;
          if (conversationId && typeof conversationId === "string") {
            result = await updateConversation(conversationId, parsedMessages);
          } else {
            result = await storeConversation(
              storedTitle || "Untitled",
              parsedMessages
            );
          }

          if (result.success) {
            await AsyncStorage.multiRemove([
              "conversationTitle",
              "conversationMessages",
            ]);
          } else {
            console.error(result.message);
          }
        }
        setActionLoading(false);
      }

      router.back();
      return true; // block default back
    } catch (err) {
      console.error("Error saving/updating conversation:", err);
      router.back();
      return true;
    }
  }, [isConversationStarted, conversationId]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBackPress(); // Don't await here — it's handled inside
        return true; // Prevent default
      }
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

  return (
    <GradientWrapper>
      {actionLoading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 z-50 justify-center items-center pointer-events-none">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <View className="flex-row items-center px-2 py-1">
        <TouchableOpacity onPress={handleBackPress} className="p-2 mr-3">
          <Feather name="arrow-left" size={24} color={Colors[theme].tabIcon} />
        </TouchableOpacity>

        <FancyText
          className="text-2xl font-semibold"
          style={{ color: Colors[theme].tabIcon }}
        >
          Chat with Serava
        </FancyText>
      </View>

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-2"
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            className={`my-2 max-w-[80%] px-4 py-2 rounded-xl ${
              msg.from === "user"
                ? "self-end bg-white/10"
                : "self-start bg-white/5"
            }`}
          >
            {msg.from === "user" ? (
              <FancyText
                className="text-lg"
                style={{ color: Colors[theme].text }}
              >
                {msg.text}
              </FancyText>
            ) : (
              <Markdown
                style={{
                  text: {
                    color: Colors[theme].text, // general text color
                    fontSize: 16,
                  },
                  listUnorderedItemIcon: {
                    color: Colors[theme].text, // Bullet point color
                  },
                  listUnorderedItemFancyText: {
                    color: Colors[theme].text, // FancyText color for list items
                  },
                }}
              >
                {msg.text}
              </Markdown>
            )}
          </View>
        ))}
        {loading && (
          <View className="flex flex-row gap-1 mb-3 ml-4">
            <View
              style={{ backgroundColor: Colors[theme].text }}
              className="w-1 h-1 rounded-full animate-bounce [animation-delay:0s]"
            ></View>
            <View
              style={{ backgroundColor: Colors[theme].text }}
              className="w-1 h-1 rounded-full animate-bounce [animation-delay:0.2s]"
            ></View>
            <View
              style={{ backgroundColor: Colors[theme].text }}
              className="w-1 h-1 rounded-full animate-bounce [animation-delay:0.4s]"
            ></View>
          </View>
        )}
      </ScrollView>

      {showScrollButton && (
        <View className="absolute bottom-20 w-full flex items-center justify-center pointer-events-auto">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={scrollToBottom}
            style={{
              backgroundColor: Colors[theme].tabBar,
            }}
            className="w-12 h-12 rounded-full flex items-center justify-center pointer-events-auto"
          >
            <Feather
              name="arrow-down"
              size={24}
              color={Colors[theme].tabIcon}
            />
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
        className="w-full px-4 pb-2"
      >
        <View
          className="flex-row items-center rounded-full px-4 py-2"
          style={{ backgroundColor: Colors[theme].primary }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="white"
            className="flex-1 text-white mr-3"
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={sendMessage}
            className="p-2 rounded-full bg-white/10"
          >
            <Feather name="send" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GradientWrapper>
  );
};

export default AiChat;
