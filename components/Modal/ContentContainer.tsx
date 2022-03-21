import { Content } from '@radix-ui/react-dialog';
import styled, { keyframes } from 'styled-components';

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.85)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

const ContentContainer = styled(Content)`
  width: 100vw;
  height: 100vh;
  background-color: white;
  border-radius: 8px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-top: 16px;
  &:focus {
    outline: none;
  }

  @media (prefers-reduced-motion: no-preference) {
    animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    width: 70vw;
    max-height: 85vh;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints[1]}) {
    width: 50vw;
  }
`;

export default ContentContainer;
