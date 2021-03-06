import styled from 'styled-components';

const StyledSelect = styled.select`
  width: 100%;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  padding: 0 8px;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: 4px;
  font-weight: bold;
  &:focus {
    outline: solid 2px ${({ theme }) => theme.colors.primary};
  }
`;

export default StyledSelect;
