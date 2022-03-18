import Box from '@components/Box';
import Button from '@components/Button';
import Footer from '@components/Footer';
import ProviderCard from '@components/ProviderList/ProviderCard';
import Text from '@components/Text';
import fetchJson from '@lib/fetchJson';
import { Provider, ProviderName } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { MdLooks3, MdLooksOne, MdLooksTwo } from 'react-icons/md';
import styles from '../styles/Home.module.css';

interface HomeProps {
  providers: Provider[];
}

const Home = ({ providers }: HomeProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const goDashboard = () => router.push('/dashboard');

  const openProviderUrl = (url: string) => window.open(url, '_blank');

  return (
    <div>
      <Head>
        <title>Xpost</title>
        <meta name='description' content='Cross posting your blog articles' />
      </Head>
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
          Empower your
          <Text color='primary' textAlign='center'>
            content
          </Text>
        </Text>

        <Text
          textAlign='center'
          color='gray.500'
          margin='3rem 0'
          lineHeight={1.5}
          fontSize='1.5rem'
        >
          Productivity tool for content creator & technical writer
        </Text>

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
          <div className={styles.card}>
            <MdLooksOne size='3rem' className='primary' />
            <Text fontSize='1.5rem' fontWeight='bold'>
              Connect your favorite blogging platforms and get your personal
              dashboard
            </Text>
          </div>

          <Box
            className={styles.imgCard}
            width={['80vw', '40vw']}
            height={['60vw', '30vw']}
            p={0}
            overflow='hidden'
          >
            <Image
              src='/demo_providers.png'
              alt='dashboard'
              layout='fill'
              objectFit='cover'
              priority={true}
            />
          </Box>
        </div>

        <Box
          className={styles.grid}
          flexDirection={['column-reverse', 'unset']}
        >
          <Box
            className={styles.imgCard}
            width={['80vw', '40vw']}
            height={['60vw', '30vw']}
            p={0}
            overflow='hidden'
          >
            <Image
              src='/demo_editor.png'
              alt='dashboard'
              layout='fill'
              objectFit='cover'
              priority={true}
            />
          </Box>
          <div className={styles.card}>
            <MdLooksTwo size='3rem' className='primary' />
            <Text fontSize='1.5rem' fontWeight='bold'>
              Enjoy a consistent writting experience with instant rendering
            </Text>
          </div>
        </Box>

        <div className={styles.grid}>
          <div className={styles.card}>
            <MdLooks3 size='3rem' className='primary' />
            <Text fontSize='1.5rem' fontWeight='bold'>
              Choose to post your article to a single, or multiple platforms at
              a time, we take care of everything
            </Text>
          </div>

          <Box
            className={styles.imgCard}
            width={['80vw', '40vw']}
            height={['60vw', '30vw']}
            p={0}
            overflow='hidden'
          >
            <Image
              src='/demo_publish.png'
              alt='dashboard'
              layout='fill'
              objectFit='cover'
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
