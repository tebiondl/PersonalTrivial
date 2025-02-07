import React from 'react';
import { Stack } from "expo-router";
import { ThemeProvider } from "./themeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
