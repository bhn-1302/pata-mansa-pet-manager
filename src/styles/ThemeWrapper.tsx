import { ThemeProvider as StyledProvider } from "styled-components";
import { useTheme } from "../context/useTheme";
import { themeLight } from "./themeLight";
import { themeDark } from "./themeDark";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  const currentTheme = theme === "light" ? themeLight : themeDark;

  return <StyledProvider theme={currentTheme}>{children}</StyledProvider>;
}
