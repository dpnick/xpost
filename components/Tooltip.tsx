import * as RadixTooltip from '@radix-ui/react-tooltip';
import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import Text from './Text';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const StyledContent = styled(RadixTooltip.Content)`
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 16px;
  line-height: 1;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.gray['200']};
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  @media (prefers-reduced-motion: no-preference) {
    &[data-state='delayed-open'] {
      animation-fill-mode: forwards;
      animation-duration: 400ms;
      animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
      &[data-side='top'] {
        animation-name: ${slideDownAndFade};
      }
      &[data-side='right'] {
        animation-name: ${slideLeftAndFade};
      }
      &[data-side='bottom'] {
        animation-name: ${slideUpAndFade};
      }
      &[data-side='left'] {
        animation-name: ${slideRightAndFade};
      }
    }
  }
`;

export default function Tooltip({ children, content }: TooltipProps) {
  const { colors } = useTheme();

  return (
    <RadixTooltip.Root delayDuration={500}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <StyledContent>
        <RadixTooltip.Arrow fill={colors.gray[400]} />
        <Text>{content}</Text>
      </StyledContent>
    </RadixTooltip.Root>
  );
}
