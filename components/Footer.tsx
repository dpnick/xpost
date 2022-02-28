import styles from '@styles/Dashboard.module.scss';
import Image from 'next/image';
import React from 'react';
import { BsTwitter } from 'react-icons/bs';
import styled from 'styled-components';
import Box from './Box';
import Text from './Text';

const StyledLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
`;

export default function Footer() {
  return (
    <Box
      className={styles.flexCenter}
      width='100%'
      flexDirection='column'
      bg='accent'
      py='24px'
    >
      <Box className={styles.flexCenter} pb='16px'>
        <Image src='/icon.svg' alt='xpost logo' width={35} height={35} />
        <Text fontWeight='bold' ml='4px'>
          XPost
        </Text>
      </Box>
      <Text color='gray' pb='4px'>
        Interested in contributing / following this product ?
      </Text>
      <StyledLink
        href='https://twitter.com/dpnick_'
        target='_blank'
        rel='noreferrer'
      >
        Join me on <BsTwitter />
      </StyledLink>
      <Text pt='16px' color='gray'>
        © Copyright 2022 XPost.
      </Text>
    </Box>
  );
}
