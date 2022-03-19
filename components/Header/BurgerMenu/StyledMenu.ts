import Box from '@components/Box';
import styled from 'styled-components';

const StyledMenu = styled(Box)<{ open: boolean }>`
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.gray['200']};
  height: 100vh;
  text-align: left;
  padding-top: 3rem;
  padding-bottom: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  z-index: 10;
  box-shadow: ${({ open }) =>
    open ? '5px 5px 15px 4px rgba(0, 0, 0, 0.4)' : ''};
  max-width: 80%;
`;

export default StyledMenu;
