import BookmarkCard, { DAILY_DEV_LOGO } from '@components/BookmarkCard';
import Box from '@components/Box';
import Button from '@components/Button';
import ChipButton from '@components/ChipButton';
import IconButton from '@components/IconButton';
import Modal from '@components/Modal';
import SidebarLayout from '@components/SidebarLayout';
import StyledInput from '@components/StyledInput';
import Text from '@components/Text';
import useBookmarks from '@hooks/useBookmarks';
import useUser from '@hooks/useUser';
import fetchJson from '@lib/fetchJson';
import { DailyDevItem } from '@models/dailyDevItem';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { RiGhostLine, RiSettings5Fill } from 'react-icons/ri';
import styled from 'styled-components';
import { HEADER_HEIGHT } from '.';

const RegisterButton = styled.input`
  min-height: 40px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 1em;
  border-radius: 8px 16px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;
  padding-right: 16px;
  cursor: pointer;
  &:active {
    opacity: 0.4;
  }
`;

const OutlineButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.gray['700']};
  border: 2px solid ${({ theme }) => theme.colors.gray['700']};
  margin-left: auto;
  margin-right: auto;
  margin-top: 16px;
`;

const CardList = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-gap: 16px;
  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (min-width: ${({ theme }) => theme.breakpoints[1]}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const DAILY_BASE_URL = 'api.daily.dev';

export default function Inspirations() {
  const { user, isLoading: userLoading, refresh: refreshUser } = useUser();
  const {
    bookmarks,
    tags,
    isLoading: bookmarkLoading,
    refresh: refreshBookmarks,
  } = useBookmarks();

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [bookmarksToDisplay, setBookmarksToDisplay] = useState<DailyDevItem[]>(
    []
  );

  useEffect(() => {
    let nextBookmarks = bookmarks;
    if (bookmarks && selectedTags?.length > 0) {
      nextBookmarks = bookmarks.filter(({ category }) => {
        if (Array.isArray(category)) {
          const intersection = selectedTags.filter((selected) =>
            category.includes(selected)
          );
          return intersection?.length > 0;
        }
        return selectedTags.includes(category);
      });
    }
    setBookmarksToDisplay(nextBookmarks!);
  }, [bookmarks, selectedTags]);

  const submitRssUrl = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitted(true);
    const rss: string = (event.target as HTMLFormElement).rss?.value;
    if (!rss.includes(DAILY_BASE_URL)) {
      toast.error("Your url doesn't seem valid");
      setSubmitted(false);
      return;
    }
    try {
      await fetchJson(
        '/api/user/add-rss',
        {
          method: 'POST',
          body: JSON.stringify({
            rss,
          }),
          headers: { 'Content-type': 'application/json' },
        },
        true,
        {
          success: 'You can now find all your Daily.dev bookmarks here 🎉',
          loading: 'Almost ready',
        }
      );
      refreshUser();
      refreshBookmarks();
    } catch {
      setSubmitted(false);
    }
  };

  const updateSelectedTags = (tag: string) => {
    const isAlreadySelected = selectedTags?.some(
      (selected) => selected === tag
    );
    if (isAlreadySelected) {
      setSelectedTags((prev) => prev.filter((selected) => selected !== tag));
      return;
    }
    setSelectedTags((prev) => [...prev, tag]);
  };

  const openDaily = () =>
    window.open('https://app.daily.dev/bookmarks', '_blank');

  return (
    <SidebarLayout isLoading={userLoading || bookmarkLoading}>
      <Box
        width={['100vw', '100vw', '100vw', '85vw']}
        minHeight={`calc(100vh - ${HEADER_HEIGHT}px)`}
        px='3vw'
        pb='10vh'
        pt='8px'
      >
        {user?.dailyDevRss ? (
          <>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
            >
              <h3>Bookmarks</h3>
              <Modal
                content={
                  <form
                    onSubmit={submitRssUrl}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-around',
                      height: '100%',
                    }}
                  >
                    <Box display='flex' justifyContent='center'>
                      <Image
                        src={DAILY_DEV_LOGO}
                        alt='daily.dev logo'
                        width={150}
                        height={150}
                      />
                    </Box>
                    <div>
                      <Text color='gray.500' fontWeight='bold'>
                        Daily.dev bookmarks sharing url
                      </Text>
                      <StyledInput
                        id='rss'
                        type='text'
                        placeholder='Enter your bookmark sharing url here'
                        autoComplete='rss'
                        required
                      />
                    </div>
                    <RegisterButton
                      disabled={submitted}
                      type='submit'
                      value='Update sharing url &rarr;'
                    />
                  </form>
                }
              >
                <IconButton color='black' Icon={RiSettings5Fill} />
              </Modal>
            </Box>
            {bookmarks && bookmarks?.length > 0 ? (
              <>
                {tags && tags?.length > 0 && (
                  <Box display='flex' flexWrap='wrap' py={3}>
                    {tags.map((tag) => {
                      const isSelected = selectedTags.some(
                        (selected) => selected === tag
                      );
                      return (
                        <ChipButton
                          key={tag}
                          color={isSelected ? 'primary' : 'gray.300'}
                          outline={!isSelected}
                          callback={() => updateSelectedTags(tag)}
                        >
                          <Text color={isSelected ? 'white' : 'gray.600'}>
                            {tag}
                          </Text>
                        </ChipButton>
                      );
                    })}
                  </Box>
                )}
                <Text textAlign='center' color='gray.500' mb={2}>
                  {bookmarksToDisplay?.length ?? '-'} corresponding{' '}
                  {bookmarksToDisplay?.length > 1 ? 'results' : 'result'}
                </Text>
                <CardList>
                  {bookmarksToDisplay?.map((bookmark) => (
                    <BookmarkCard key={bookmark.guid} bookmark={bookmark} />
                  ))}
                </CardList>
              </>
            ) : (
              <Box
                height='100%'
                display='flex'
                justifyContent='center'
                alignItems='center'
                flexDirection='column'
              >
                <RiGhostLine size={48} color='black' />
                <Text my={3} color='gray.600' textAlign='center'>
                  No bookmark yet...
                </Text>
                <Button label='Visit daily.dev' onClick={openDaily} />
              </Box>
            )}
          </>
        ) : (
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Box width={['90%', '90%', '70%']}>
              <Box display='flex' justifyContent='center' mt={3}>
                <Image
                  src={DAILY_DEV_LOGO}
                  alt='daily.dev logo'
                  width={150}
                  height={150}
                />
              </Box>
              <Text
                color='gray.500'
                textAlign='center'
                width={['100%', '50%']}
                mx='auto'
              >
                Quickly access all your inspirations in a single place & speed
                up your writing process
              </Text>
              <OutlineButton label='Go to daily.dev' onClick={openDaily} />
              <Image
                alt='instructions'
                src='/instructions/rss_daily_dev.svg'
                width={1100}
                height={630}
                layout='responsive'
                priority
              />
              <form
                onSubmit={submitRssUrl}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <Text color='gray.500' fontWeight='bold'>
                  Daily.dev bookmarks sharing url
                </Text>
                <StyledInput
                  id='rss'
                  type='text'
                  placeholder='Enter your bookmark sharing url here'
                  autoComplete='rss'
                  required
                />
                <RegisterButton
                  disabled={submitted}
                  type='submit'
                  value="Let's go &rarr;"
                />
              </form>
            </Box>
          </Box>
        )}
      </Box>
    </SidebarLayout>
  );
}

Inspirations.auth = true;
