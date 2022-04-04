import useScreenSize from '@hooks/useScreenSize';
import styles from '@styles/Dashboard.module.scss';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import router from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import Box from '../Box';
import Text from '../Text';
import Avatar from './Avatar';
import BurgerMenu from './BurgerMenu';
import ModalUser from './ModalUser';

enum Greetings {
  MORNING = 'Good morning',
  AFTERNOON = 'Good afternoon',
  EVENING = 'Good evening',
}

export default function Header() {
  const [greeting, setGreeting] = useState<string>();
  const { data: session } = useSession();
  const { breakpoints } = useTheme();
  const { width } = useScreenSize();

  const avatarRef = useRef(null);

  useEffect(() => {
    let nextGreeting = Greetings.EVENING;
    const hour = new Date().getHours();
    if (hour < 12) {
      nextGreeting = Greetings.MORNING;
    } else if (hour < 20) {
      nextGreeting = Greetings.AFTERNOON;
    }
    setGreeting(nextGreeting);
  }, []);

  const goDashboard = () => router.push('/dashboard');

  const goHome = () => router.push('/');

  return (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      bg='accent'
      paddingX='3vw'
      height='80px'
      borderBottomStyle='solid'
      borderBottomColor='gray.300'
    >
      <Box display='flex' alignItems='center'>
        <Box className={styles.pointer} onClick={goHome} mr='16px'>
          <Image src='/icon.svg' alt='xpost logo' width={35} height={35} />
        </Box>
        <h3 className={styles.pointer} onClick={goDashboard}>
          {greeting}
          {session?.user?.name && (
            <span>
              ,
              <Text
                textTransform='capitalize'
                fontWeight='bold'
                color='primary'
                display='unset'
              >
                &nbsp;{session.user.name}
              </Text>
            </span>
          )}
        </h3>
      </Box>
      <Box display='flex'>
        {width > Number(breakpoints[2].split('px')[0]) ? (
          <ModalUser session={session}>
            <Avatar ref={avatarRef} session={session} />
          </ModalUser>
        ) : (
          <BurgerMenu session={session} />
        )}
      </Box>
    </Box>
  );
}
