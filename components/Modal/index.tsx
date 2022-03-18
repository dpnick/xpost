import Box from '@components/Box';
import styles from '@styles/Dashboard.module.scss';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { IoMdClose } from 'react-icons/io';
import ContentContainer from './ContentContainer';
import ModalOverlay from './Overlay';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  const [isBrowser, setIsBrowser] = useState(false);
  const modalWrapperRef = useRef<HTMLDivElement>(null);

  const backDropHandler = useCallback(
    (event: MouseEvent) => {
      const target = event?.target as Node;
      if (target && !modalWrapperRef?.current?.contains(target)) {
        document.body.classList.remove('modal-open');
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    setIsBrowser(true);
    document.body.classList.add('modal-open');
    window.addEventListener('click', backDropHandler);

    return () => window.removeEventListener('click', backDropHandler);
  }, [backDropHandler]);

  const handleCloseClick = (event: React.MouseEvent<SVGElement>) => {
    event.preventDefault();
    document.body.classList.remove('modal-open');
    onClose();
  };

  const modalContent = (
    <ModalOverlay>
      <ContentContainer ref={modalWrapperRef}>
        <Box bg='white' height='100%' width='100%' borderRadius='8px' py='16px'>
          <Box display='flex' justifyContent='flex-end' px='16px'>
            <IoMdClose onClick={handleCloseClick} className={styles.pointer} />
          </Box>
          <Box height='100%' overflowY='auto' px='16px'>
            {children}
          </Box>
        </Box>
      </ContentContainer>
    </ModalOverlay>
  );

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById('modal-root')!
    );
  } else {
    return null;
  }
}
