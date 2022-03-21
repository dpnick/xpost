import Box from '@components/Box';
import styled from 'styled-components';

const StyledBurger = styled(Box)<{ open: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  &:focus {
    outline: none;
  }

  div {
    height: 0.25rem;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    :first-child {
      margin-left: auto;
      width: ${({ open }) => (open ? '2rem' : '1.5rem')};
      transform: ${({ open }) => (open ? 'rotate(45deg)' : 'rotate(0)')};
    }

    :nth-child(2) {
      width: 1.5rem;
      opacity: ${({ open }) => (open ? '0' : '1')};
      transform: ${({ open }) => (open ? 'translateX(20px)' : 'translateX(0)')};
    }

    :nth-child(3) {
      width: ${({ open }) => (open ? '2rem' : '1.5rem')};
      margin-left: auto;
      transform: ${({ open }) => (open ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }
`;

export default StyledBurger;
