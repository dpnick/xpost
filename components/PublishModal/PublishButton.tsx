import styled from 'styled-components';

const PublishButton = styled.input`
  width: 100%;
  height: 40px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 16px;
  margin-bottom: 16px;
  transition: background 0.5s ease-in-out;
  &:active {
    opacity: 0.4;
  }
  &:disabled {
    background: ${({ theme }) => theme.colors.gray[300]};
  }
`;

export default PublishButton;
