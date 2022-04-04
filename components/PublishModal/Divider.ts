import styled from 'styled-components';

const Divider = styled.div`
  border: 0;
  height: 2px;
  background-image: linear-gradient(
    to right,
    transparent,
    ${({ theme }) => theme.colors.gray[300]},
    transparent
  );
  margin-top: ${({ theme }) => theme.space[2]}px;
  margin-bottom: ${({ theme }) => theme.space[3]}px;
`;

export default Divider;
