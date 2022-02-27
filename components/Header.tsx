import styles from '@styles/Dashboard.module.scss';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import Box from './Box';
import Text from './Text';

enum Greetings {
  MORNING = 'Good morning',
  AFTERNOON = 'Good afternoon',
  EVENING = 'Good evening',
}

export default function Header() {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState<string>();

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

  return (
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
      <Box
        display='flex'
        alignItems='center'
        onClick={() => router.push('/dashboard')}
      >
        <Image src='/icon.svg' alt='Share blog Logo' width={35} height={35} />
        <h3 style={{ cursor: 'pointer', marginLeft: 16 }}>
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
            />
          ) : (
            <AiOutlineUser color='black' />
          )}
        </Box>
      </Box>
    </Box>
  );
}
