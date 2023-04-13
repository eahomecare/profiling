import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import React from "react";

export const theme = {
  colorScheme: "light",
};



export function ThemeProvider({ children }) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      {children}
    </MantineProvider>
  );
}
