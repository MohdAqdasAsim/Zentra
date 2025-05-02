// Common components
import BackgroundWrapper from "./common/BackgroundWrapper";
import CustomHeader from "./common/CustomHeader";
import GradientWrapper from "./common/GradientWrapper";
import ToolboxPageWrapper from "./common/ToolboxPageWrapper";
import ConfirmModal from "./common/ConfirmModal";
import NoInternetModal from "./common/NoInternetModal";
import NotLoggedInModal from "./common/NotLoggedInModal";
import FieldEmptyModal from "./common/FieldEmptyModal";
import FancyText from "./common/FancyText";

// Authentication components
import EmailSentModal from "./auth/EmailSentModal";
import LoginSignUpModal from "./auth/LoginSignUpModal";
import ForgotPasswordModal from "./auth/ForgotPasswordModal";

// Onboarding components
import SlidesFlatList from "./onboarding/SlidesFlatList";

// Navigation components
import { TabBar } from "./navigation/TabBar";

// Home components
import MoodPickerCard from "./home/MoodPickerCard";
import DailyFocusCard from "./home/DailyFocusCard";
import JournalCard from "./home/JournalCard";
import AiCard from "./home/AiCard";
import ToolboxCard from "./home/ToolboxCard";
import QuoteCard from "./home/QuoteCard";

// Chat Components
import ConversationItem from "./chat/ConversationItem";

// Journal Components
import { JournalItem } from "./journal/JournalItem";
import SaveModal from "./journal/SaveModal";
import DiscardChangesModal from "./journal/DiscardChangesModal";

// Exporting all components in a clean manner
export {
  // Navigation
  TabBar,

  // Home
  MoodPickerCard,
  DailyFocusCard,
  JournalCard,
  AiCard,
  ToolboxCard,
  QuoteCard,

  // Chat
  ConversationItem,
  
  // Journal
  JournalItem,
  SaveModal,
  DiscardChangesModal,
  
  // Common
  BackgroundWrapper,
  GradientWrapper,
  ToolboxPageWrapper,
  CustomHeader,
  ConfirmModal,
  NoInternetModal,
  NotLoggedInModal,
  FieldEmptyModal,
  FancyText,

  // Authentication
  LoginSignUpModal,
  EmailSentModal,
  ForgotPasswordModal,

  // Onboarding
  SlidesFlatList,
};
