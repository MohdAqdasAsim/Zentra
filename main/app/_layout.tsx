import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { NetworkProvider } from "@/contexts/NetworkProvider";
import { AlertProvider } from "@/contexts/AlertProvider";
import { View } from "react-native";
import { ErrorBoundary } from "react-error-boundary";
import { FontProvider } from "@/contexts/FontProvider";
import Constants from "expo-constants";
import { AuthProvider } from "@/contexts/AuthProvider";
import { FancyText } from "@/components";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function ErrorFallback({ error }: { error: Error }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <FancyText
        style={{ fontSize: 18, marginBottom: 10, textAlign: "center" }}
      >
        😓 Oops! Something went wrong.
      </FancyText>
      <FancyText style={{ fontSize: 14, color: "red", textAlign: "center" }}>
        {error.message}
      </FancyText>
    </View>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Heartful: require("../assets/fonts/Heartful.ttf"),
  });

  useEffect(() => {
    const warmBackend = async () => {
      const backendUrl = Constants.expoConfig?.extra?.BACKEND_URL;
      try {
        const res = await fetch(`${backendUrl}/ping`);
        res.ok
          ? console.log("✅ Backend is awake!")
          : console.warn("⚠️ Backend ping returned non-200");
      } catch (error) {
        console.error("🔥 Backend wake-up failed:", error);
      }
    };

    warmBackend();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <FontProvider>
        <ThemeProvider>
          <AuthProvider>
            <NetworkProvider>
              <AlertProvider>
                <Stack screenOptions={{ headerShown: false }} />
                <StatusBar style="auto" />
              </AlertProvider>
            </NetworkProvider>
          </AuthProvider>
        </ThemeProvider>
      </FontProvider>
    </ErrorBoundary>
  );
}
