import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen, Ubuntu,
    Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    text-rendering: optimizeLegibility;
  }
  *, *::after, *::before {
    box-sizing: border-box;
  }

  .primary {
  color: ${({ theme }) => theme.colors.primary};
}

.pointer {
  cursor: pointer;
}

.canvas {
  background-color: transparent;
  height: 100%;
  left: 0px;
  pointer-events: none;
  position: fixed;
  top: 0px;
  width: 100%;
}

// custom editor
.ProseMirror {
  p {
    font-size: 1.2rem;
    line-height: 1.5;
  }

  h3 {
    font-size: 1.3rem;
  }
}
  `;
