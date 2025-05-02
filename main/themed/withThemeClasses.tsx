import React from "react";
import { useTheme } from "@/contexts/ThemeProvider";

export function withThemeClasses<P extends { className?: string }>(
  WrappedComponent: React.ComponentType<P>
) {
  const ComponentWithTheme = (props: P) => {
    const { theme } = useTheme();

    const transformedClassName =
      props.className?.replace(
        /(\b(?:bg|text|border))-(primary|background|gradientStart|gradientEnd|text|accent|surface|[a-zA-Z]+)/g,
        (_, prefix, key) => `${prefix}-${theme}-${key}`
      ) || "";

    return <WrappedComponent {...props} className={transformedClassName} />;
  };

  return ComponentWithTheme;
}
