import Box from '@components/Box';
import IconButton from '@components/IconButton';
import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';
import { IoMdClose } from 'react-icons/io';
import ContentContainer from './ContentContainer';
import ModalOverlay from './Overlay';

interface ModalProps {
  open?: boolean;
  onChange?: () => void;
  content: React.ReactNode;
  children?: React.ReactNode;
}

export default function Modal({
  open,
  onChange,
  children,
  content,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <ModalOverlay>
          <ContentContainer>
            <Dialog.Close asChild>
              <Box display='flex' justifyContent='flex-end' height={32} px={3}>
                <IconButton Icon={IoMdClose} color='black' />
              </Box>
            </Dialog.Close>
            <Box height='calc(100% - 32px)' overflowY='auto' px={3}>
              {content}
            </Box>
          </ContentContainer>
        </ModalOverlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
