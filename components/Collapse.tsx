import React, { useEffect, useRef, useState } from 'react';
import { IoChevronDownSharp } from 'react-icons/io5';
import styled from 'styled-components';
import Box from './Box';

const CollapsedDiv = styled.div<{ height: number | undefined }>`
  overflow: hidden;
  transition: height 0.2s ease-in-out;
  height: ${({ height }) => (height ? `${height}px` : 0)};
`;

const AnimatedIcon = styled(IoChevronDownSharp)<{ open: boolean }>`
  font-size: 24px;
  transition: transform 0.2s;
  transform: ${({ open }) => (open ? 'rotate(180deg)' : 'rotate(0)')};
`;

interface CollapseProps {
  open?: boolean;
  title: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

export default function Collapse({
  open,
  title,
  children,
  headerAction,
}: CollapseProps) {
  const [isOpen, setIsOpen] = useState<boolean>(open ?? false);
  const [height, setHeight] = useState<number | undefined>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let nextHeight = 0;
    if (isOpen && ref.current) {
      nextHeight = ref.current?.getBoundingClientRect().height;
    }
    setHeight(nextHeight);
  }, [isOpen]);

  const toggleOpening = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <Box
        onClick={toggleOpening}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        borderBottom={`1px solid ${isOpen ? 'lightgray' : 'transparent'}`}
        padding='16px'
        borderRadius='8px'
        style={{ cursor: 'pointer' }}
      >
        <h4>{title}</h4>
        <Box display='flex' alignItems='center'>
          {headerAction}
          <AnimatedIcon open={isOpen} />
        </Box>
      </Box>

      <CollapsedDiv height={height}>
        <div ref={ref}>
          <Box padding='16px'>{children}</Box>
        </div>
      </CollapsedDiv>
    </>
  );
}
