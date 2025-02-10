import React from 'react';
import { Stack } from "expo-router";
import { ThemeProvider } from "./themeContext";
import { NetworkProvider } from "./networkContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NetworkProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </NetworkProvider>
    </ThemeProvider>
  );
}
