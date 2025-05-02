import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Font Context
interface FontContextType {
  isFontEnabled: boolean;
  toggleFont: () => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

// Custom Hook
export const useFont = (): FontContextType => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error("useFont must be used within a FontProvider");
  }
  return context;
};

// Provider
export const FontProvider = ({ children }: { children: ReactNode }) => {
  const [isFontEnabled, setIsFontEnabled] = useState<boolean>(false);

  // Load font setting
  useEffect(() => {
    const loadFontSetting = async () => {
      try {
        const stored = await AsyncStorage.getItem("isFontEnabled");
        if (stored !== null) {
          setIsFontEnabled(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Failed to load font setting:", err);
      }
    };
    loadFontSetting();
  }, []);

  // Toggle font state
  const toggleFont = async () => {
    try {
      const newState = !isFontEnabled;
      setIsFontEnabled(newState);
      await AsyncStorage.setItem("isFontEnabled", JSON.stringify(newState));
    } catch (err) {
      console.error("Failed to save font setting:", err);
    }
  };

  return (
    <FontContext.Provider value={{ isFontEnabled, toggleFont }}>
      {children}
    </FontContext.Provider>
  );
};
