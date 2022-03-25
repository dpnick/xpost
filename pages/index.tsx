import Box from '@components/Box';
import Button from '@components/Button';
import Footer from '@components/Footer';
import ProviderCard from '@components/ProviderList/ProviderCard';
import Text from '@components/Text';
import Tooltip from '@components/Tooltip';
import fetchJson from '@lib/fetchJson';
import { Provider, ProviderName } from '@prisma/client';
import styles from '@styles/Home.module.scss';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { IconType } from 'react-icons';
import { MdLock, MdLooks3, MdLooksOne, MdLooksTwo } from 'react-icons/md';
import { RiOpenSourceFill } from 'react-icons/ri';

interface HomeProps {
  providers: Provider[];
}

interface Advantage {
  id: number;
  Icon: IconType;
  title: string;
  desc: string;
}

const advantages: Advantage[] = [
  {
    id: 1,
    Icon: MdLock,
    title: 'Secure',
    desc: 'Your sensitive data are encrypted and protected.',
  },
  {
    id: 2,
    Icon: RiOpenSourceFill,
    title: 'Open-source',
    desc: 'The code repository is accessible for everyone on GitHub.',
  },
];

const Home = ({ providers }: HomeProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const goDashboard = () => router.push('/dashboard');

  const openProviderUrl = (url: string) => window.open(url, '_blank');

  return (
    <div>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        bg='accent'
        paddingX='3vw'
        borderBottom='2px solid white'
        height='80px'
        borderBottomWidth='1px solid'
        borderBottomColor='gray.300'
      >
        <Box display='flex' alignItems='center'>
          <Image src='/icon.svg' alt='xpost logo' width={35} height={35} />
          <Text className={styles.pointer} fontWeight='bold' ml='16px'>
            XPost
          </Text>
        </Box>
        <Box display='flex' alignItems='center'>
          <Text color='gray.500' mr='16px'>
            beta
          </Text>
          <Button
            label={session?.user ? 'Dashboard' : 'Get started'}
            onClick={goDashboard}
          />
        </Box>
      </Box>

      <main className={styles.main}>
        <Text fontSize='4rem' fontWeight='bold' textAlign='center'>
          Write once
          <Text color='primary' textAlign='center'>
            publish everywhere
          </Text>
        </Text>

        <Text
          textAlign='center'
          color='gray.500'
          mt='3rem'
          mb='1rem'
          lineHeight={1.5}
          fontSize='1.5rem'
        >
          Productivity tool for content creators & technical writers
        </Text>

        <Box display='flex' justifyContent='center' flexWrap='wrap' mb='3rem'>
          {advantages.map(({ id, Icon, title, desc }, index) => (
            <Tooltip key={id} content={desc}>
              <Box
                display='flex'
                alignItems='center'
                borderRadius={8}
                border='1px solid'
                borderColor='gray.300'
                p={2}
                mr={index + 1 === advantages.length ? 0 : 2}
              >
                <Icon size={20} />
                <Text ml={2}>{title}</Text>
              </Box>
            </Tooltip>
          ))}
        </Box>
        <Box display='flex' justifyContent='center'>
          {providers?.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              setProvider={() =>
                openProviderUrl(
                  ProviderName.DEV === provider.name
                    ? 'https://dev.to'
                    : 'https://hashnode.com'
                )
              }
            />
          ))}
        </Box>

        <div className={styles.grid}>
          <Text
            textAlign={['center', 'center', 'left']}
            className={styles.card}
          >
            <MdLooksOne size='3rem' className='primary' />
            <Text fontSize='1.5rem' fontWeight='bold'>
              Connect your favorite blogging platforms and get your personal
              dashboard
            </Text>
          </Text>

          <Box
            className={styles.imgCard}
            width={['80vw', '70vw', '40vw']}
            height='100%'
            p={0}
            overflow='hidden'
          >
            <Image
              src='/demo_providers.png'
              alt='dashboard'
              width={1240}
              height={860}
              layout='responsive'
              priority={true}
            />
          </Box>
        </div>

        <Box
          className={styles.grid}
          flexDirection={['column-reverse', 'column-reverse', 'unset']}
        >
          <Box
            className={styles.imgCard}
            width={['80vw', '70vw', '40vw']}
            height='100%'
            p={0}
            overflow='hidden'
          >
            <Image
              src='/demo_editor.png'
              alt='dashboard'
              width={1240}
              height={860}
              layout='responsive'
              priority={true}
            />
          </Box>
          <Text
            textAlign={['center', 'center', 'left']}
            className={styles.card}
          >
            <MdLooksTwo size='3rem' className='primary' />
            <Text fontSize='1.5rem' fontWeight='bold'>
              Enjoy a consistent writting experience with instant rendering
            </Text>
          </Text>
        </Box>

        <div className={styles.grid}>
          <Text
            textAlign={['center', 'center', 'left']}
            className={styles.card}
          >
            <MdLooks3 size='3rem' className='primary' />
            <Text fontSize='1.5rem' fontWeight='bold'>
              Choose to post your article to a single, or multiple platforms at
              a time, we take care of everything
            </Text>
          </Text>

          <Box
            className={styles.imgCard}
            width={['80vw', '70vw', '40vw']}
            height='100%'
            p={0}
            overflow='hidden'
          >
            <Image
              src='/demo_publish.png'
              alt='dashboard'
              width={1240}
              height={860}
              layout='responsive'
              priority={true}
            />
          </Box>
        </div>
        <Box mt='3rem'>
          <Button label="Let's try" onClick={goDashboard} />
        </Box>
      </main>

      <Footer />
    </div>
  );
};

export async function getStaticProps() {
  let providers: Provider[] = [];
  try {
    providers = await fetchJson(
      `${process.env.NEXTAUTH_URL}/api/provider/get-public`
    );
  } catch {
    toast.error('An error occured getting providers');
  }

  return {
    props: {
      providers,
    },
  };
}

export default Home;
