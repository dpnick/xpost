import Box from '@components/Box';
import Button from '@components/Button';
import { DashboardPath, InspirationsPath } from '@components/SidebarLayout';
import SideBarElement from '@components/SidebarLayout/SideBarElement';
import Text from '@components/Text';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { AiOutlineBulb, AiOutlineHome } from 'react-icons/ai';
import styled from 'styled-components';
import Avatar from '../Avatar';
import StyledBurger from './StyledBurger';
import StyledMenu from './StyledMenu';

const StyledOverlay = styled.div`
  position: absolute;
  background-color: transparent;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  top: 0;
  left: 0;
`;

const LogoutButton = styled(Button)`
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.danger};
  transition: background-color ease-in-out 0.2s;
  font-size: 0.8em;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['200']};
  }
`;

interface BurgerMenuProps {
  session: Session | null;
}

export default function BurgerMenu({ session }: BurgerMenuProps) {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  const goDashboard = () => {
    router.push(DashboardPath);
    setOpen(false);
  };
  const goInspirations = () => {
    router.push(InspirationsPath);
    setOpen(false);
  };

  const toggleSidebar = () => setOpen((prev) => !prev);
  const closeSidebar = () => setOpen(false);

  const logout = () => signOut();

  return (
    <>
      <StyledBurger open={open} onClick={toggleSidebar}>
        <div />
        <div />
        <div />
      </StyledBurger>
      {open && <StyledOverlay onClick={closeSidebar} />}
      <StyledMenu open={open} minWidth={['60%', '30%']}>
        <div>
          <SideBarElement
            label='Dashboard'
            isSelected={router.asPath === DashboardPath}
            Icon={AiOutlineHome}
            onClick={goDashboard}
          />
          <SideBarElement
            label='Inspirations'
            isSelected={router.asPath === InspirationsPath}
            Icon={AiOutlineBulb}
            onClick={goInspirations}
          />
        </div>
        <div>
          <Box
            display='flex'
            borderTopStyle='solid'
            borderTopColor='gray.300'
            borderTopWidth='2px'
            pt={3}
          >
            <Avatar session={session} />
            <Box ml={2}>
              <Text fontWeight='bold' textTransform='capitalize'>
                {session?.user?.name}
              </Text>
              <Text fontSize='0.8em'>{session?.user?.email}</Text>
            </Box>
          </Box>
          <LogoutButton label='Sign out' onClick={logout} />
        </div>
      </StyledMenu>
    </>
  );
}
