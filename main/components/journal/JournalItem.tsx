import { View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import FancyText from "../common/FancyText";

type JournalItemProps = {
  journalId: string;
  title?: string;
  content?: string;
  createdAt?: any; // Timestamp or Date
  onPress: () => void;
  onDelete: () => void;
};

export const JournalItem = ({
  journalId,
  title,
  content,
  createdAt,
  onPress,
  onDelete,
}: JournalItemProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      className="w-full bg-white/10 border border-white/20 rounded-xl p-4 mb-4 flex flex-row justify-between"
      onPress={onPress}
    >
      <View className="flex-1 pr-2">
        <FancyText
          className="font-semibold text-lg"
          style={{ color: Colors[theme].text }}
        >
          {title || "Untitled Journal"}
        </FancyText>
        <FancyText
          className="text-sm mt-1"
          numberOfLines={2}
          style={{ color: Colors[theme].text }}
        >
          {content || "No content yet..."}
        </FancyText>
        <FancyText
          className="text-xs mt-1"
          style={{ color: Colors[theme].text }}
        >
          {createdAt
            ? new Date(createdAt.seconds * 1000).toDateString()
            : "No date"}
        </FancyText>
      </View>

      <TouchableOpacity onPress={onDelete}>
        <Feather name="trash-2" size={20} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
