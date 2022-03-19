import { useRouter } from 'next/router';
import React from 'react';
import { AiOutlineBulb, AiOutlineHome } from 'react-icons/ai';
import Box from '../Box';
import Footer from '../Footer';
import SideBarElement from './SideBarElement';

interface SideBarWrapperProps {
  children: React.ReactNode;
}

export const DashboardPath = '/dashboard';
export const InspirationsPath = '/dashboard/inspirations';

export default function SideBarWrapper({ children }: SideBarWrapperProps) {
  const router = useRouter();

  const goDashboard = () => router.push(DashboardPath);
  const goInspirations = () => router.push(InspirationsPath);

  return (
    <Box width='100%' bg='white'>
      <Box display='flex'>
        <Box
          display={['none', 'none', 'none', 'unset']}
          width='15vw'
          flexShrink={0}
          bg='accent'
          borderRightColor='gray.300'
          borderRightStyle='solid'
          pt='3em'
          px={3}
        >
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
        </Box>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
