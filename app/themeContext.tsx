import React, { createContext, useContext, useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Define the config file path. While the instructions mention a 'data' folder, in a React Native Expo app we use the documentDirectory for persistent storage.
const CONFIG_FILE_PATH = FileSystem.documentDirectory + 'optionsConfig.json';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    async function loadConfig() {
      const fileInfo = await FileSystem.getInfoAsync(CONFIG_FILE_PATH);
      if (fileInfo.exists) {
        try {
          const content = await FileSystem.readAsStringAsync(CONFIG_FILE_PATH);
          const parsed = JSON.parse(content);
          if (parsed.theme) {
            setTheme(parsed.theme);
          }
        } catch (error) {
          console.error('Error reading config:', error);
        }
      } else {
        // File doesn't exist, create it with default config
        await FileSystem.writeAsStringAsync(CONFIG_FILE_PATH, JSON.stringify({ theme: 'light' }));
      }
    }
    loadConfig();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await FileSystem.writeAsStringAsync(CONFIG_FILE_PATH, JSON.stringify({ theme: newTheme }));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 