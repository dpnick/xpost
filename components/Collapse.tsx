import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface CollapseProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const CollapsedDiv = styled.div<{ height: number | undefined }>`
  overflow: hidden;
  transition: height 0.2s ease-in-out;
  height: ${({ height }) => (height ? `${height}px` : 0)};
`;

export default function Collapse({ isOpen, children }: CollapseProps) {
  const [height, setHeight] = useState<number | undefined>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!height || !isOpen || !ref.current) return;
    const resizeObserver = new ResizeObserver((el) => {
      setHeight(el[0].contentRect.height);
    });
    resizeObserver.observe(ref.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [height, isOpen]);

  useEffect(() => {
    let nextHeight = 0;
    if (isOpen && ref.current) {
      nextHeight = ref.current?.getBoundingClientRect().height;
    }
    setHeight(nextHeight);
  }, [isOpen]);

  return (
    <CollapsedDiv height={height}>
      <div ref={ref}>{children}</div>
    </CollapsedDiv>
  );
}
