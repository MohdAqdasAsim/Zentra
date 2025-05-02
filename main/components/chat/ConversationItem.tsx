import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import FancyText from "../common/FancyText";
type Message = { from: "user" | "ai"; text: string };

type ConversationItemProps = {
  conversation: {
    id: string;
    title?: string;
    messages?: Object;
    preview?: string;
    timestamp?: any;
  };
  onPress: () => void;
  onDelete: () => void;
};

const ConversationItem = ({
  conversation,
  onPress,
  onDelete,
}: ConversationItemProps) => {
  const { theme } = useTheme();

  const messages = conversation.messages as Message[] | undefined;

  return (
    <TouchableOpacity
      className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 mb-4 flex flex-row justify-between"
      onPress={onPress}
    >
      <View>
        <FancyText
          className="font-semibold text-lg"
          style={{ color: Colors[theme].text }}
        >
          {conversation.title || "Untitled Conversation"}
        </FancyText>
        <FancyText className="text-sm" style={{ color: Colors[theme].text }}>
          {(messages && messages[0].text + " . . .") ||
            "Start talking to Serava..."}
        </FancyText>
        <FancyText
          className="text-xs mt-1"
          style={{ color: Colors[theme].text }}
        >
          {conversation.timestamp
            ? new Date(conversation.timestamp.seconds * 1000).toDateString()
            : "No date"}
        </FancyText>
      </View>

      <TouchableOpacity onPress={onDelete}>
        <Feather name="trash-2" size={20} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ConversationItem;
