import { useFont } from "@/contexts/FontProvider";
import { Text, TextProps } from "react-native";

const FancyText = ({ style, ...props }: TextProps) => {
  const { isFontEnabled } = useFont();
  return (
    <Text
      {...props}
      style={[{ fontFamily: isFontEnabled ? "Heartful" : "Arial" }, style]}
    />
  );
};

export default FancyText;
