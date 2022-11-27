import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as v4Id } from 'uuid';
import { getRandomImages } from './api/get-random-images';
import { shuffleArr } from './utils/shuffle-arr';
import { getFulfilledPromises } from './utils/get-fulfilled-promises';
import { useDebounce } from './hooks/useDebounce';
import { MemoryCard } from './components/memory-card';
import { DEFAULT_NUMBER_CARDS } from './constant';
import './App.css';

function App() {
  const totalAmountCards = useRef<number>(DEFAULT_NUMBER_CARDS);
  const [images, setImages] = useState<string[]>([]);

  const [selectedCards, setSelectedCards] = useState<Map<string, string>>(
    new Map()
  );

  const [guessedPair, setGuessedPair] = useState<
    Map<string, { pair: string[] }>
  >(new Map());

  useEffect(() => {
    const length = totalAmountCards.current / 2;
    const controller = new AbortController();

    const promises = [...Array(length)].map(() =>
      getRandomImages({ controller })
    );

    getFulfilledPromises({ promises })
      .then((p) => p.map(({ message: imageSource }) => imageSource))
      .then(setImages);

    return () => {
      controller.abort();
      setImages([]);
    };
  }, []);

  const memoryCardsData = useMemo(() => {
    const updatedData = images.reduce<{ imageSrc: string; setId: string }[]>(
      (acc, imageSrc: string) => {
        const updatedObj = {
          imageSrc,
          setId: v4Id(),
        };

        return [...acc, updatedObj];
      },
      []
    );

    return shuffleArr([...updatedData, ...updatedData]);
  }, [images]);

  const handleCardClick = useCallback(
    ({ cardId, cardSetId }: { cardId: string; cardSetId: string }) => {
      if (selectedCards.size === 2) return;

      setSelectedCards((prevSelectedCards) => {
        const updated = new Map(prevSelectedCards);
        updated.set(cardId, cardSetId);

        return updated;
      });
    },
    []
  );

  const updatedSelectedCards = useDebounce({
    ms: 1500,
    value: selectedCards,
  });

  useEffect(() => {
    if (updatedSelectedCards.size <= 1) return;

    const [[firstImageId, firstImageSetId], [secondImageId, secondImageSetId]] =
      selectedCards;

    //* if they belong to the same set then add them amongs the
    if (firstImageSetId === secondImageSetId) {
      setGuessedPair((prev) => {
        const updated = new Map(prev);

        updated.set(firstImageSetId.toString(), {
          pair: [firstImageId, secondImageId],
        });

        return updated;
      });
    }

    //* reset previously selected cards
    setSelectedCards(new Map());
  }, [updatedSelectedCards]);

  const gameFinished: boolean =
    guessedPair.size === totalAmountCards.current / 2;

  return (
    <div className='App'>
      <div className='wrapper'>
        {gameFinished ? (
          <h1>Game finished!</h1>
        ) : (
          <div className='memory__grid'>
            {memoryCardsData.map((cardData, index: number) => (
              <MemoryCard
                key={`card-${index}-${cardData.setId}`}
                {...cardData}
                id={index.toString()}
                isCardSelected={selectedCards.has(index.toString())}
                hasBeenGuessed={guessedPair.has(cardData.setId)}
                handleCardClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
