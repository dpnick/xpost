import styled from 'styled-components';
import {
  color,
  ColorProps,
  compose,
  layout,
  LayoutProps,
  space,
  SpaceProps,
  system,
  typography,
  TypographyProps,
} from 'styled-system';

/**
 * Generic text component
 */

interface TextCustomProps {
  textTransform?: string;
  textDecoration?: string;
}

type TextProps = ColorProps &
  SpaceProps &
  TypographyProps &
  TextCustomProps &
  LayoutProps;

// system used to extend styled-system property to text-transform
const Text = styled.span<TextProps>`
  display: block;
  ${system({
    textTransform: {
      property: 'textTransform',
      transform: (value) => value,
    },
    textDecoration: {
      property: 'textDecoration',
      transform: (value) => value,
    },
  })}
  ${compose(color, space, typography, layout)}
`;

export default Text;
