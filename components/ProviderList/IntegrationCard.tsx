import Box from '@components/Box';
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
import Text from '../Text';
import Stat from './Stat';

interface IntegrationCardProps {
  integration: Integration;
  provider: Provider;
  infos: IntegrationInfos;
}

export default function IntegrationCard({
  integration,
  provider,
  infos,
}: IntegrationCardProps) {
  const { refresh } = useProviders();

  const deleteIntegration = async (toastId: string) => {
    try {
      toast.dismiss(toastId);
      await fetchJson(
        '/api/integration/delete',
        {
          method: 'POST',
          body: JSON.stringify({
            token: integration.token,
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
      marginRight={['16px', 0]}
      className={styles.card}
      padding='0'
    >
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        bg='accent'
        p='8px'
        borderBottom='1px solid lightgray'
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
          <MdDelete
            size={24}
            onClick={showConfirm}
            className={styles.pointer}
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
        py='24px'
        px='8px'
      >
        <Stat
          value={infos?.followersCount}
          label='followers'
          Icon={RiUserFollowLine}
        />
        <Stat
          value={infos?.reactionsCount}
          label='reactions'
          Icon={MdOutlineAddReaction}
        />
        <Stat value={infos?.postsCount} label='posts' Icon={MdPostAdd} />
      </Box>
      <Box display='flex' alignItems='center' justifyContent='center' pb='16px'>
        <BsCheckCircleFill size={16} color='#24b47e' />
        <Text ml='8px'>Ready to publish</Text>
      </Box>
    </Box>
  );
}
