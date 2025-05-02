import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FancyText, ToolboxPageWrapper } from "@/components";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";

const focusTime = 25 * 60;
const breakTime = 5 * 60;

const FocusTimer = () => {
  const [secondsLeft, setSecondsLeft] = useState(focusTime);
  const [isRunning, setIsRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);

  // Load the timer state from AsyncStorage when the component mounts
  useEffect(() => {
    const loadTimerState = async () => {
      try {
        const state = await AsyncStorage.getItem("FOCUS_TIMER_STATE");
        if (state) {
          const { secondsLeft, isRunning, onBreak } = JSON.parse(state);
          setSecondsLeft(secondsLeft);
          setIsRunning(isRunning);
          setOnBreak(onBreak);
        }
      } catch (e) {
        console.error("Error loading timer state:", e);
      }
    };

    loadTimerState();
  }, []);

  // Save the timer state to AsyncStorage whenever it changes
  useEffect(() => {
    const saveTimerState = async () => {
      try {
        await AsyncStorage.setItem(
          "FOCUS_TIMER_STATE",
          JSON.stringify({ secondsLeft, isRunning, onBreak })
        );
      } catch (e) {
        console.error("Error saving timer state:", e);
      }
    };

    saveTimerState();
  }, [secondsLeft, isRunning, onBreak]);

  // Timer countdown logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && secondsLeft > 0) {
      timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    }

    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      setOnBreak((prev) => !prev);
      setSecondsLeft(onBreak ? focusTime : breakTime);
    }

    return () => clearTimeout(timer);
  }, [isRunning, secondsLeft]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const { theme } = useTheme();

  return (
    <ToolboxPageWrapper title="Focus Timer">
      <BlurView
        intensity={60}
        tint="light"
        className="flex-1 px-8 py-10 rounded-3xl items-center justify-center overflow-hidden"
      >
        <FancyText className="text-white text-7xl font-extrabold mb-4 text-shadow-neon">
          {formatTime(secondsLeft)}
        </FancyText>
        <FancyText
          className="italic text-lg mb-6"
          style={{ color: Colors[theme].text }}
        >
          {onBreak ? "Break Time ☕" : "Focus Mode 🔥"}
        </FancyText>

        <TouchableOpacity
          onPress={() => setIsRunning((r) => !r)}
          className="bg-white/10 border border-white rounded-2xl px-6 py-3"
        >
          <FancyText className="text-white text-lg font-semibold">
            {isRunning ? "Pause" : "Start"}
          </FancyText>
        </TouchableOpacity>
      </BlurView>
    </ToolboxPageWrapper>
  );
};

export default FocusTimer;
