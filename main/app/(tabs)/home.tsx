import {
  AiCard,
  DailyFocusCard,
  GradientWrapper,
  JournalCard,
  MoodPickerCard,
  QuoteCard,
  ToolboxCard,
} from "@/components";
import { ScrollView } from "react-native";

export default function App() {
  const cardComponents = [
    <MoodPickerCard key="moodPicker" />,
    <DailyFocusCard key="dailyFocus" />,
    <JournalCard key="journal" />,
    <AiCard key="aiCard" />,
    <ToolboxCard key="toolbox" />,
    <QuoteCard key="quote" />,
  ];

  return (
    <GradientWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        {cardComponents}
      </ScrollView>
    </GradientWrapper>
  );
}
