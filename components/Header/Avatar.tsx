import Box from '@components/Box';
import styles from '@styles/Dashboard.module.scss';
import { Session } from 'next-auth';
import Image from 'next/image';
import React, { forwardRef } from 'react';
import { AiOutlineUser } from 'react-icons/ai';

interface AvatarProps {
  session: Session | null;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { session, ...props },
  ref
) {
  return (
    <Box
      {...props}
      ref={ref}
      display='flex'
      className={styles.pointer}
      position='relative'
      borderRadius='50%'
      width={35}
      height={35}
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
  );
});

export default Avatar;
