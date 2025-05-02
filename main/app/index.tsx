import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useFirstLaunch } from "@/hooks/useFirstLaunch";
import { BackgroundWrapper } from "@/components";
import OnBoarding from "./misc/on-boarding";
import { useRouter } from "expo-router";

const App = () => {
  const isFirstLaunch = useFirstLaunch();
  const router = useRouter();

  useEffect(() => {
    if (isFirstLaunch === false) {
      requestAnimationFrame(() => {
        router.replace("/home");
      });
    }
  }, [isFirstLaunch]);

  if (isFirstLaunch === null) {
    return (
      <BackgroundWrapper>
        <ActivityIndicator size="large" color="#513d73" />
      </BackgroundWrapper>
    );
  }

  if (isFirstLaunch) {
    return <OnBoarding />;
  }

  return null;
};

export default App;
