import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import {
  ConfirmModal,
  ConversationItem,
  FancyText,
  GradientWrapper,
} from "@/components";
import {
  fetchUserConversations,
  deleteConversation,
} from "@/services/firebaseFunctions";
import { Feather } from "@expo/vector-icons";
import { useNetwork } from "@/contexts/NetworkProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { Colors } from "@/constants/Colors";

type Conversation = {
  id: string;
  title?: string;
  preview?: string;
  timestamp?: any;
};

export default function Chat() {
  const { isConnected } = useNetwork();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // 👇 State for modal
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadConversations = async () => {
        setLoading(true);
        const result = await fetchUserConversations();

        if (result.success) {
          setConversations(result.data);
        } else {
          console.warn(result.message);
        }

        setLoading(false);
      };

      loadConversations();
    }, [])
  );

  const handleDelete = (id: string) => {
    setSelectedConvId(id);
    setConfirmVisible(true); // Show modal
  };

  const confirmDelete = async () => {
    if (selectedConvId) {
      const result = await deleteConversation(selectedConvId);
      if (result.success) {
        setConversations((prev) =>
          prev.filter((conv) => conv.id !== selectedConvId)
        );
      } else {
        console.warn(result.message);
      }
    }
    setConfirmVisible(false);
  };

  const handlePress = (id: string) => {
    router.push(`/chat/ai-chat?conversationId=${id}`);
  };

  return (
    <GradientWrapper>
      {isConnected ? (
        <>
          {isLoggedIn ? (
            <>
              {loading ? (
                <View className="flex-1 justify-center items-center">
                  <ActivityIndicator size="large" color="#ffffff" />
                </View>
              ) : (
                <FlatList
                  data={conversations}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <ConversationItem
                      conversation={item}
                      onPress={() => handlePress(item.id)}
                      onDelete={() => handleDelete(item.id)} // 👈 use the modal-triggering function
                    />
                  )}
                  ListEmptyComponent={
                    <View className="flex-1 items-center mt-10">
                      <FancyText
                        className="text-white text-2xl"
                        style={{ color: Colors[theme].text }}
                      >
                        No conversations yet
                      </FancyText>
                    </View>
                  }
                  ListFooterComponent={<View className="mb-28" />}
                />
              )}

              {/* New Chat Floating Button */}
              <TouchableOpacity
                className="absolute bottom-24 right-6 bg-white/20 border border-white/30 p-4 rounded-full"
                onPress={() => {
                  router.push("/chat/ai-chat");
                }}
              >
                <Feather name="plus" size={28} color="white" />
              </TouchableOpacity>

              {/* 👇 Reusable Confirmation Modal */}
              <ConfirmModal
                visible={confirmVisible}
                title="Delete Conversation?"
                message="Are you sure you want to delete this chat? This can't be undone."
                confirmFancyText="Delete"
                cancelFancyText="Cancel"
                onConfirm={confirmDelete}
                onCancel={() => setConfirmVisible(false)}
              />
            </>
          ) : (
            <View className="flex-1 items-center justify-center px-4">
              <Feather name="log-in" size={40} color="white" className="mb-4" />
              <FancyText className="text-white text-xl font-semibold text-center mb-2">
                You’re not logged in
              </FancyText>
              <FancyText className="text-white/70 text-base text-center mb-4">
                Please log in to view and manage your conversations.
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
        </>
      ) : (
        <View className="flex-1 items-center justify-center px-4">
          <Feather name="wifi-off" size={40} color="white" className="mb-4" />
          <FancyText className="text-white text-xl font-semibold text-center mb-2">
            You're Offline
          </FancyText>
          <FancyText className="text-white/70 text-base text-center">
            Connect to the internet to access this feature and sync your
            journals.
          </FancyText>
        </View>
      )}
    </GradientWrapper>
  );
}
