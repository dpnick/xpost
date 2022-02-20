import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    breakpoints: string[];
    fontSizes: number[];
    space: number[];
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      accent: string;
    };
  }
}
