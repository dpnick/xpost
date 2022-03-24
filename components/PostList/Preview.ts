import Text from '@components/Text';
import styled from 'styled-components';

const Preview = styled(Text)`
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: 6rem; // fallback to line-clamp
  margin-top: auto;
  margin-bottom: auto;
  white-space: break-spaces;
`;

export default Preview;
