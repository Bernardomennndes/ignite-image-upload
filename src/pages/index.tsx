import { useMemo } from 'react';
import Head from 'next/head';

import { Button, Box } from '@chakra-ui/react';
import { useInfiniteQuery } from 'react-query';

import { api } from '../services/api';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

type ImageData = {
  data: Card[];
  after: string | null;
};

export default function Home(): JSX.Element {
  async function loadImagesData({ pageParam = null }): Promise<ImageData> {
    if (pageParam) {
      const { data } = await api.get(`/api/images`, {
        params: {
          after: pageParam,
        },
      });

      return data;
    }
    const { data } = await api.get(`/api/images`);
    return data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', loadImagesData, {
    getNextPageParam: lastPage => lastPage?.after ?? null,
  });

  const formattedData = useMemo(() => {
    let imagesDataFormatted = [] as Card[];
    const pageData = data?.pages;

    pageData?.map(page => {
      imagesDataFormatted = [...imagesDataFormatted, ...page.data];
    });

    return imagesDataFormatted;
  }, [data]);

  if (isLoading && !isError) {
    return <Loading />;
  }

  if (isError && !isLoading) {
    return <Error />;
  }

  return (
    <>
      <Head>
        <title>Upfi | Homepage</title>
      </Head>

      <Header />

      <Box maxW={1120} px={['0.5rem', 20]} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            mt="1rem"
            onClick={() => fetchNextPage()}
            role="button"
            w={['100%', 'auto']}
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
