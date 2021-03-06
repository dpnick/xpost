import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    breakpoints: string[];
    fontSizes: number[];
    space: number[];
    colors: {
      primary: string;
      secondary: string;
      danger: string;
      success: string;
      warning: string;
      background: string;
      text: string;
      accent: string;
      gray: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
    };
  }
}
