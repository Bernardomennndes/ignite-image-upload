import { useState } from 'react';
import { SimpleGrid, useDisclosure } from '@chakra-ui/react';

import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { onOpen, isOpen, onClose } = useDisclosure();

  const [imageUrlSelected, setImageUrlSelected] = useState('');

  function handleOpenModal(url: string): void {
    setImageUrlSelected(url);
    onOpen();
  }

  return (
    <>
      <SimpleGrid columns={[1, 2, 3]} spacing="2.5rem">
        {cards.map(card => (
          <Card
            key={card.id}
            data={card}
            viewImage={url => handleOpenModal(url)}
          />
        ))}
      </SimpleGrid>

      {isOpen && (
        <ModalViewImage
          imgUrl={imageUrlSelected}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
}
