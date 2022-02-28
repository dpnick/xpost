import { StorageKeys } from '@models/storage';
import React, { createContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from 'styles/Theme';

interface IThemeContext {
  isDarkTheme: boolean | undefined;
  switchTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext>({
  isDarkTheme: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  switchTheme: () => {},
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState<boolean>();

  // on component first render => check if we have a theme value in async storage
  // otherwise => take user prefered theme
  useEffect(() => {
    const setUserTheme = async () => {
      try {
        const useDarkMode = localStorage.getItem(StorageKeys.USE_DARK_MODE);
        let result = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (useDarkMode !== null) {
          result = JSON.parse(useDarkMode);
        }
        setIsDark(result);
      } catch {
        toast.error('An error occured getting your saved theme');
      }
    };
    setUserTheme();
  }, []);

  const switchTheme = async () => {
    setIsDark((prev) => !prev);
    try {
      localStorage.setItem(StorageKeys.USE_DARK_MODE, JSON.stringify(!isDark));
    } catch {
      toast.error('An error occured while updating theme');
    }
  };

  // wrap `styled-components` provider with our own one
  return (
    <ThemeContext.Provider
      value={{
        isDarkTheme: isDark,
        switchTheme,
      }}
    >
      <StyledThemeProvider theme={isDark ? darkTheme : lightTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
