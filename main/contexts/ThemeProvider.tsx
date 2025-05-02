import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";

export type Theme = keyof typeof Colors;

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  ambientSounds: boolean;
  setAmbientSounds: (enabled: boolean) => void;
}>({
  theme: "joy",
  setTheme: () => {},
  ambientSounds: false,
  setAmbientSounds: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("sorrow");
  const [ambientSounds, setAmbientSoundsState] = useState<boolean>(false);
  const [loaded, setLoaded] = useState(false); // Prevent overwrite on startup

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    AsyncStorage.setItem("theme", newTheme);
  };

  const setAmbientSounds = (enabled: boolean) => {
    setAmbientSoundsState(enabled);
    AsyncStorage.setItem("ambientSounds", JSON.stringify(enabled));
  };

  // Load theme & ambientSounds from storage
  useEffect(() => {
    const loadSettings = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      const savedSounds = await AsyncStorage.getItem("ambientSounds");

      if (savedTheme && Colors[savedTheme as Theme]) {
        setThemeState(savedTheme as Theme);
      }

      if (savedSounds !== null) {
        setAmbientSoundsState(JSON.parse(savedSounds));
      }

      setLoaded(true);
    };

    if (!loaded) {
      loadSettings();
    }
  }, [loaded]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, ambientSounds, setAmbientSounds }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
