import {
  View,
  Pressable,
  LayoutChangeEvent,
  GestureResponderEvent,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather, FontAwesome } from "@expo/vector-icons";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import FancyText from "../common/FancyText";

// Define the valid icon names for all 5 tabs
type IconName = "home" | "chat" | "journal" | "toolbox" | "profile";

// Define the icon mapping for each tab
const icon: Record<IconName, (props: any) => React.JSX.Element> = {
  home: (props: any) => <FontAwesome name="home" size={24} {...props} />,
  chat: (props: any) => <FontAwesome name="comments" size={24} {...props} />,
  journal: (props: any) => <FontAwesome name="book" size={24} {...props} />,
  toolbox: (props: any) => <Feather name="tool" size={24} {...props} />,
  profile: (props: any) => <FontAwesome name="user" size={24} {...props} />,
};

// Define the TabBar component
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
  const buttonWidth = dimensions.width / state.routes.length;

  const { theme } = useTheme();

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <>
      <View
        onLayout={onTabbarLayout}
        style={{ backgroundColor: Colors[theme].tabBar }}
        className="absolute bottom-4 flex-row justify-between items-center mx-[32px] h-16 w-5/6 rounded-full shadow-md"
      >
        <Animated.View
          style={[
            animatedStyle,
            {
              height: dimensions.height - 15,
              width: buttonWidth - 24,
              backgroundColor: Colors[theme].tabIcon,
            },
          ]}
          className="absolute rounded-full mx-3.5"
        />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          // Ensure that label is a string
          const labelString =
            typeof label === "string"
              ? label
              : typeof label === "function"
              ? (label({
                  focused: state.index === index,
                  color: "white",
                  position: "beside-icon", // Use valid LabelPosition here
                  children: "",
                }) as string)
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            tabPositionX.value = withSpring(buttonWidth * index, {
              duration: 1500,
            });
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabBarButton
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              routeName={route.name as IconName}
              color={isFocused ? "white" : "black"}
              label={labelString}
            />
          );
        })}
      </View>
    </>
  );
}

// Define the TabBarButtonProps interface with a specific IconName type for routeName
interface TabBarButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  onLongPress: (event: GestureResponderEvent) => void;
  isFocused: boolean;
  routeName: IconName;
  color: string;
  label: string;
}

// Define the TabBarButton component
function TabBarButton({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  color,
  label,
}: TabBarButtonProps) {
  const { theme, setTheme } = useTheme();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const topValue = interpolate(scale.value, [0, 1], [0, 9]);

    return {
      transform: [
        {
          scale: scaleValue,
        },
      ],
      top: topValue,
    };
  });

  const animatedFancyTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      opacity,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center justify-center p-2"
    >
      <Animated.View style={animatedIconStyle}>
        {icon[routeName] &&
          icon[routeName]({
            color: isFocused ? Colors[theme].tabBar : Colors[theme].tabIcon,
          })}
      </Animated.View>
      <FancyText
        style={[{ color: Colors[theme].tabIcon }, animatedFancyTextStyle]}
        className="text-[10px] mt-1"
      >
        {isFocused ? "" : label}
      </FancyText>
    </Pressable>
  );
}
