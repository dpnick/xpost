import styled from 'styled-components';

const ContentContainer = styled.div`
  width: 100vw;
  height: 100vh;

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    width: 70vw;
    height: 90vh;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints[1]}) {
    width: 50vw;
    height: 90vh;
  }
`;

export default ContentContainer;
