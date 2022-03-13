import { Overlay } from '@radix-ui/react-dialog';
import styled, { keyframes } from 'styled-components';

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const ModalOverlay = styled(Overlay)`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  @media (prefers-reduced-motion: no-preference) {
    animation: ${overlayShow} 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

export default ModalOverlay;
