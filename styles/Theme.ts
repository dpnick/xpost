import { DefaultTheme } from 'styled-components';

const lightTheme: DefaultTheme = {
  breakpoints: ['768px', '1024px'],
  fontSizes: [12, 14, 16, 20, 24, 32, 36], // could also be defined as em
  space: [0, 4, 8, 16, 32, 64],
  colors: {
    primary: '#24b47e',
    secondary: '#F4845F',
    background: '#FEFEFF',
    text: 'black',
    accent: '#F5F7FA',
  },
};

const darkTheme: DefaultTheme = {
  breakpoints: ['768px', '1024px'],
  fontSizes: [12, 14, 16, 20, 24, 32, 36],
  space: [0, 4, 8, 16, 32, 64],
  colors: {
    primary: '#24b47e',
    secondary: '#334756',
    background: '#272838',
    text: 'white',
    accent: '#F5F7FA',
  },
};

enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export { lightTheme, darkTheme, Theme };
