import Box from '@components/Box';
import styled from 'styled-components';

const PostCardContainer = styled(Box)`
  margin: 8px 0;
  padding: 16px;
  display: flex;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

export default PostCardContainer;
