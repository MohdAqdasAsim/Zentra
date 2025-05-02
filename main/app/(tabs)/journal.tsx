import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import {
  ConfirmModal,
  FancyText,
  GradientWrapper,
  JournalItem,
} from "@/components";
import { useCallback, useState } from "react";
import {
  deleteJournalEntry,
  fetchUserJournals,
} from "@/services/firebaseFunctions";
import { Feather } from "@expo/vector-icons";
import { useNetwork } from "@/contexts/NetworkProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";

type JournalEntry = {
  journalId: string;
  title?: string;
  content?: string;
  createdAt?: any;
};

export default function Journals() {
  const { isConnected } = useNetwork();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(
    null
  );

  useFocusEffect(
    useCallback(() => {
      const loadJournals = async () => {
        setLoading(true);
        const result = await fetchUserJournals();

        if (result.success) {
          setJournals(result.data);
        } else {
          console.warn(result.message);
        }

        setLoading(false);
      };

      loadJournals();
    }, [])
  );

  const handleDelete = (journalId: string) => {
    setSelectedJournalId(journalId);
    setConfirmVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedJournalId) {
      await deleteJournalEntry(selectedJournalId);
      setJournals((prev) =>
        prev.filter((j) => j.journalId !== selectedJournalId)
      );
      setConfirmVisible(false);
    }
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
                  data={journals}
                  keyExtractor={(item) => item.journalId}
                  renderItem={({ item }) => (
                    <JournalItem
                      journalId={item.journalId}
                      title={item.title}
                      content={item.content}
                      createdAt={item.createdAt}
                      onPress={() =>
                        router.push(
                          `/journal/journal?journalId=${item.journalId}`
                        )
                      }
                      onDelete={() => handleDelete(item.journalId)}
                    />
                  )}
                  ListEmptyComponent={() => (
                    <View className="flex-1 items-center mt-10">
                      <FancyText
                        className="text-white text-2xl"
                        style={{ color: Colors[theme].text }}
                      >
                        No journals yet
                      </FancyText>
                    </View>
                  )}
                  ListFooterComponent={<View className="mb-28" />}
                />
              )}

              {/* New Journal Floating Button */}
              <TouchableOpacity
                className="absolute bottom-24 right-6 bg-white/20 border border-white/30 p-4 rounded-full"
                onPress={() => {
                  router.push("/journal/journal");
                }}
              >
                <Feather name="plus" size={28} color="white" />
              </TouchableOpacity>

              <ConfirmModal
                visible={confirmVisible}
                onConfirm={confirmDelete}
                onCancel={() => setConfirmVisible(false)}
                title="Delete Journal?"
                message="Are you sure you want to delete this journal entry?"
                confirmFancyText="Delete"
                cancelFancyText="Cancel"
              />
            </>
          ) : (
            <View className="flex-1 items-center justify-center px-4">
              <Feather name="log-in" size={40} color="white" className="mb-4" />
              <FancyText className="text-white text-xl font-semibold text-center mb-2">
                You’re not logged in
              </FancyText>
              <FancyText className="text-white/70 text-base text-center mb-4">
                Please log in to view and manage your journals.
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
