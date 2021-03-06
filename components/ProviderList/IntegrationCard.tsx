import Box from '@components/Box';
import IconButton from '@components/IconButton';
import Spinner from '@components/Spinner';
import useProviders from '@hooks/useProviders';
import fetchJson from '@lib/fetchJson';
import { IntegrationInfos } from '@models/integration';
import { Integration, Provider } from '@prisma/client';
import styles from '@styles/Dashboard.module.scss';
import Image from 'next/image';
import React from 'react';
import toast from 'react-hot-toast';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { BsCheckCircleFill } from 'react-icons/bs';
import { MdDelete, MdOutlineAddReaction, MdPostAdd } from 'react-icons/md';
import { RiUserFollowLine } from 'react-icons/ri';
import { useTheme } from 'styled-components';
import Text from '../Text';
import Stat from './Stat';

interface IntegrationCardProps {
  integration: Integration;
  provider: Provider;
  infos: IntegrationInfos;
  isStatsLoading: boolean;
}

export default function IntegrationCard({
  integration,
  provider,
  infos,
  isStatsLoading,
}: IntegrationCardProps) {
  const { refresh } = useProviders();
  const { colors } = useTheme();

  const deleteIntegration = async (toastId: string) => {
    try {
      toast.dismiss(toastId);
      await fetchJson(
        '/api/integration/delete',
        {
          method: 'POST',
          body: JSON.stringify({
            integrationId: integration.id,
          }),
          headers: { 'Content-type': 'application/json' },
        },
        true
      );
      refresh();
    } catch {
      toast.error('Something went wrong while deleting');
    }
  };

  const showConfirm = () => {
    toast(
      (ref) => (
        <Box>
          <span>
            Confirm to delete &nbsp;
            <button onClick={() => deleteIntegration(ref.id)}>OK</button>
          </span>
        </Box>
      ),
      {
        icon: <AiFillQuestionCircle color='orange' />,
      }
    );
  };

  return (
    <Box
      minWidth={['60vw', 0]}
      marginRight={['16px', '16px', 0]}
      className={styles.card}
      padding='0'
    >
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        bg='accent'
        p='8px'
        borderBottomStyle='solid'
        borderBottomColor='gray.300'
        borderBottomWidth='2px'
        borderTopLeftRadius='8px'
        borderTopRightRadius='8px'
      >
        <Box display='flex' alignItems='center'>
          <Image
            src={provider!.logoUrl}
            alt='provider logo'
            height={35}
            width={35}
          />
          <Text fontSize='1.2em' fontWeight='bold' ml='16px'>
            {provider?.displayName}
          </Text>
        </Box>
        <Box display='flex' alignItems='center'>
          <IconButton
            Icon={MdDelete}
            color='black'
            hoverColor={colors.danger}
            onClick={showConfirm}
          />
        </Box>
      </Box>
      <Box mt='16px' className={styles.flexCenter}>
        <Text fontWeight='bold' textTransform='capitalize'>
          {integration?.username}
        </Text>
      </Box>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-evenly'
        position='relative'
        py='24px'
        px='8px'
      >
        {isStatsLoading ? (
          <Spinner width={20} height={20} icon={false} />
        ) : (
          <>
            <Stat
              value={infos?.followersCount}
              label='followers'
              description='Current total number of followers'
              Icon={RiUserFollowLine}
            />
            <Stat
              value={infos?.reactionsCount}
              label='reactions'
              description='Current total number of reactions on your articles'
              Icon={MdOutlineAddReaction}
            />
            <Stat
              value={infos?.postsCount}
              label='posts'
              description='Current number of article published'
              Icon={MdPostAdd}
            />
          </>
        )}
      </Box>
      <Box display='flex' alignItems='center' justifyContent='center' pb='16px'>
        <BsCheckCircleFill size={16} color='#24b47e' />
        <Text ml='8px'>Ready to publish</Text>
      </Box>
    </Box>
  );
}
