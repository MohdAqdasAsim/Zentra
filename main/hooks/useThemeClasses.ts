import { useTheme } from "@/contexts/ThemeProvider";

export const useThemeClasses = () => {
  const { theme } = useTheme();

  const getClassName = (className: string) => {
    // Replace 'text-primary' or 'bg-primary' with 'text-[theme]-primary'
    return className.replace(/(\b(?:bg|text|border))-(primary|background|accent|surface|[a-zA-Z]+)/g, (_, prefix, key) => {
      return `${prefix}-${theme}-${key}`; // Adds the dash: e.g., text-serenity-primary
    });
  };

  return { getClassName };
};
