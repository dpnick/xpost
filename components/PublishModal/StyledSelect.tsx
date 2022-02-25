import styled from 'styled-components';

const StyledSelect = styled.select`
  width: 100%;
  height: 40px;
  border: 1px solid lightgray;
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 4px;
  font-weight: bold;
  &:focus {
    outline: solid 2px ${({ theme }) => theme.colors.primary};
  }
`;

export default StyledSelect;
