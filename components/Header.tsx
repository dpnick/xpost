import styles from '@styles/Dashboard.module.scss';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import styled from 'styled-components';
import Box from './Box';
import Button from './Button';
import Modal from './Modal';
import StyledInput from './StyledInput';
import Text from './Text';

enum Greetings {
  MORNING = 'Good morning',
  AFTERNOON = 'Good afternoon',
  EVENING = 'Good evening',
}

const ErrorButton = styled(Button)`
  background-color: white;
  color: red;
  border: 1px solid red;
`;

export default function Header() {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState<string>();
  const [showProfile, setShowProfile] = useState<boolean>(false);

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
    <>
      {showProfile && (
        <Modal onClose={() => setShowProfile(false)}>
          <Box
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
            height='100%'
            py='16px'
          >
            <Box>
              <Text color='gray'>Username</Text>
              <StyledInput disabled value={session?.user?.name ?? '-'} />
              <Text color='gray'>Email</Text>
              <StyledInput disabled value={session?.user?.email ?? '-'} />
            </Box>
            <ErrorButton label='Sign out' onClick={() => signOut()} />
          </Box>
        </Modal>
      )}
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        bg='accent'
        paddingX='3vw'
        borderBottom='2px solid white'
        height='80px'
        borderBottomWidth='1px solid'
        borderBottomColor='lightgray'
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
          <Box
            className={styles.pointer}
            position='relative'
            borderRadius='50%'
            width={35}
            height={35}
            display='flex'
            justifyContent='center'
            alignItems='center'
            bg='white'
            overflow='hidden'
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt='user image'
                layout='fill'
                objectFit='cover'
                onClick={() => setShowProfile(true)}
              />
            ) : (
              <AiOutlineUser color='black' />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
