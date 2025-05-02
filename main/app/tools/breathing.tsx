import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Easing,
  TextInput,
} from "react-native";
import { FancyText, ToolboxPageWrapper } from "@/components";
import { BlurView } from "expo-blur";

const DURATIONS = [1, 3, 5]; // in minutes

const BreathingGuide = () => {
  const [selectedMode, setSelectedMode] = useState<"4-7-8" | "Box" | "Custom">(
    "4-7-8"
  );
  const [duration, setDuration] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState("Ready");
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  const [customInhale, setCustomInhale] = useState(5);
  const [customHold, setCustomHold] = useState(0);
  const [customExhale, setCustomExhale] = useState(5);

  const scale = useRef(new Animated.Value(1)).current;

  // Mode configurations
  const MODES = {
    "4-7-8": { inhale: 4, hold: 7, exhale: 8 },
    Box: { inhale: 4, hold: 4, exhale: 4 },
    Custom: { inhale: customInhale, hold: customHold, exhale: customExhale }, // Editable custom mode
  };

  // Start looped breathing animation
  const startBreathingCycle = () => {
    const { inhale, hold, exhale } = MODES[selectedMode];

    setPhase("Inhale");
    Animated.timing(scale, {
      toValue: 1.5,
      duration: inhale * 1000,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start(() => {
      setPhase("Hold");

      setTimeout(() => {
        setPhase("Exhale");

        Animated.timing(scale, {
          toValue: 1,
          duration: exhale * 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }).start(() => {
          // Recursively continue if session isn't over
          if (isRunning && timeLeft > 0) {
            startBreathingCycle();
          }
        });
      }, hold * 1000);
    });
  };

  // Track countdown timer
  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setPhase("Done");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning]);

  // Start cycle when toggled
  useEffect(() => {
    if (isRunning) {
      startBreathingCycle();
    } else {
      scale.setValue(1); // Stop the animation if not running
    }
  }, [isRunning, selectedMode]);

  const handleStartPause = () => {
    if (!isRunning) setTimeLeft(duration * 60); // reset time if starting fresh
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setPhase("Ready");
    scale.setValue(1); // Stop the animation on reset
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <ToolboxPageWrapper title="Breathing Guide">
      <BlurView intensity={40} className="flex-1 rounded-2xl overflow-hidden">
        {/* Mode Selector */}
        <View className="flex-row justify-between border-b border-white/30">
          {Object.keys(MODES).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setSelectedMode(mode as keyof typeof MODES)}
              className={`w-1/3 px-4 items-center py-2 ${
                selectedMode === mode
                  ? "bg-white rounded-t-md"
                  : "bg-transparent"
              }`}
            >
              <FancyText
                className={`text-lg ${
                  selectedMode === mode ? "text-black" : "text-white/70"
                }`}
              >
                {mode}
              </FancyText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Mode Inputs */}
        {selectedMode === "Custom" && (
          <View className="m-4">
            <TextInput
              value={String(customInhale)}
              onChangeText={(text) => setCustomInhale(Number(text))}
              keyboardType="numeric"
              placeholder="Inhale (seconds)"
              style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginBottom: 8,
              }}
            />
            <TextInput
              value={String(customHold)}
              onChangeText={(text) => setCustomHold(Number(text))}
              keyboardType="numeric"
              placeholder="Hold (seconds)"
              style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginBottom: 8,
              }}
            />
            <TextInput
              value={String(customExhale)}
              onChangeText={(text) => setCustomExhale(Number(text))}
              keyboardType="numeric"
              placeholder="Exhale (seconds)"
              style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
            />
          </View>
        )}

        {/* Breathing Animation */}
        <View className="items-center justify-center my-10 flex-1">
          <Animated.View
            style={{
              width: 150,
              height: 150,
              borderRadius: 75,
              backgroundColor: "rgba(255,255,255,0.15)",
              transform: [{ scale }],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FancyText className="text-white font-bold text-lg">
              {phase}
            </FancyText>
          </Animated.View>
        </View>

        {/* Session Duration */}
        <View className="flex-row justify-around mb-6">
          {DURATIONS.map((d) => (
            <TouchableOpacity
              key={d}
              onPress={() => {
                if (!isRunning) setDuration(d);
              }}
              className={`px-4 py-2 rounded-lg border ${
                duration === d ? "bg-white border-white" : "border-white/30"
              }`}
            >
              <FancyText
                className={`${
                  duration === d ? "text-black" : "text-white"
                } text-sm`}
              >
                {d} min
              </FancyText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Timer + Controls */}
        <FancyText className="text-center text-white mb-4 text-xl font-semibold">
          {formatTime(timeLeft)}
        </FancyText>

        <View className="flex-row justify-around mb-12">
          <TouchableOpacity
            onPress={handleStartPause}
            className="bg-green-400 px-6 py-3 rounded-xl"
          >
            <FancyText className="text-black font-semibold">
              {isRunning ? "Pause" : "Start"}
            </FancyText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleReset}
            className="bg-red-500 px-6 py-3 rounded-xl"
          >
            <FancyText className="text-white font-semibold">Reset</FancyText>
          </TouchableOpacity>
        </View>
      </BlurView>
    </ToolboxPageWrapper>
  );
};

export default BreathingGuide;
