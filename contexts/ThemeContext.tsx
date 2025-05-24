import { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (value: boolean) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  setDarkMode: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setDarkMode = (value: boolean) => {
    setIsDarkMode(value);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}