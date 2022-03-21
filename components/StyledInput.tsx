import styled from 'styled-components';

interface StyledInputProps {
  disabled?: boolean;
}

const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  margin-top: 4px;
  margin-bottom: 16px;
  padding: 0 8px;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: 4px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-weight: bold;
  &:focus {
    outline: solid 2px ${({ theme }) => theme.colors.primary};
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

export default StyledInput;
