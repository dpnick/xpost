import styled from 'styled-components';
import {
  border,
  BorderProps,
  borderRadius,
  BorderRadiusProps,
  color,
  ColorProps,
  compose,
  flex,
  flexbox,
  FlexboxProps,
  FlexProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
} from 'styled-system';

/**
 * Generic Box component
 */

type BoxProps = ColorProps &
  SpaceProps &
  PositionProps &
  FlexProps &
  FlexboxProps &
  LayoutProps &
  ShadowProps &
  BorderProps &
  BorderRadiusProps;

const Box = styled.div<BoxProps>(
  { boxSizing: 'border-box' },
  compose(
    color,
    space,
    position,
    flex,
    flexbox,
    layout,
    shadow,
    border,
    borderRadius
  )
);

export default Box;
