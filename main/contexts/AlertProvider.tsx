import { FancyText } from "@/components";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // ✅ Make sure this is installed
import { Colors } from "@/constants/Colors";
import { useTheme } from "./ThemeProvider";

type AlertType = "success" | "error" | "warning" | "info";
type AlertContextType = (type: AlertType, message: string) => void;

const AlertContext = createContext<AlertContextType>(() => {});
export const useAlert = () => useContext(AlertContext);

const SCREEN_HEIGHT = Dimensions.get("window").height;

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showAlert = useCallback((type: AlertType, message: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setAlert({ type, message });

    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    timeoutRef.current = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setAlert(null);
      });
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      {alert && (
        <Animated.View
          style={[styles.alertWrapper, { transform: [{ translateY }] }]}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              Animated.timing(translateY, {
                toValue: SCREEN_HEIGHT,
                duration: 300,
                useNativeDriver: true,
              }).start(() => setAlert(null));
            }}
          >
            <LinearGradient
              colors={[Colors[theme].gradientStart, Colors[theme].gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.alertContainer}
            >
              <FancyText
                style={{ color: Colors[theme].text }}
                className="text-center"
              >
                {alert.message}
              </FancyText>
            </LinearGradient>
          </TouchableWithoutFeedback>
        </Animated.View>
      )}
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  alertWrapper: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
  },
  alertContainer: {
    width: "80%",
    padding: 16,
    borderRadius: 24,
    backgroundColor: "#9486f0",
    opacity: 0.95,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  alertFancyText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
