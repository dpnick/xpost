import { DefaultTheme } from 'styled-components';

const lightTheme: DefaultTheme = {
  breakpoints: ['768px', '1024px'],
  fontSizes: [12, 14, 16, 20, 24, 32, 36], // could also be defined as em
  space: [0, 4, 8, 16, 32, 64],
  colors: {
    primary: '#24b47e',
    secondary: '#F4845F',
    danger: '#e57373',
    success: '#81c784',
    warning: '#ffb74d',
    background: '#FEFEFF',
    text: 'black',
    accent: '#F5F7FA',
    gray: {
      50: '#f9fafb',
      100: '#F5F7FA',
      200: '#eaeaea',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
};

const darkTheme: DefaultTheme = {
  breakpoints: ['768px', '1024px'],
  fontSizes: [12, 14, 16, 20, 24, 32, 36],
  space: [0, 4, 8, 16, 32, 64],
  colors: {
    primary: '#24b47e',
    secondary: '#334756',
    danger: '#d32f2f',
    success: '#388e3c',
    warning: '#f57c00',
    background: '#272838',
    text: 'white',
    accent: '#F5F7FA',
    gray: {
      50: '#f9fafb',
      100: '#F5F7FA',
      200: '#eaeaea',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
};

enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export { lightTheme, darkTheme, Theme };
