import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as v4Id } from 'uuid';
import './App.css';
import { MemoryCard } from './components/memory-card';
import { BASE_API_URL, DEFAULT_NUMBER_CARDS } from './constant';
import { getEnvVariable } from './utils/get-env-variable';
import { shuffleArr } from './utils/shuffle-arr';

type ApiResponseType = {
  message: string;
  status: string;
};

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
    const apiBaseUrl = getEnvVariable({ name: 'API_BASE_URL' }) ?? BASE_API_URL;
    const apiEndpoint = `${apiBaseUrl}/breeds/image/random`;

    const length = totalAmountCards.current / 2;
    const endpoints = [...Array(length)].fill(apiEndpoint);

    const controller = new AbortController();

    const getRandomImages = async (): Promise<string[]> => {
      const promisesSettledResult = await Promise.allSettled(
        endpoints.map((endpoint) =>
          fetch(endpoint, { method: 'GET', signal: controller.signal }).then(
            (res) => res.json()
          )
        )
      );

      const randomImages = promisesSettledResult
        .filter(({ status }) => status === 'fulfilled')
        .map(
          (p) => (p as PromiseFulfilledResult<ApiResponseType>).value.message
        );

      return randomImages;
    };

    getRandomImages().then(setImages);

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

  useEffect(() => {
    if (selectedCards.size <= 1) return;

    const [[firstImageId, firstImageSetId], [secondImageId, secondImageSetId]] =
      selectedCards;

    //TODO: create custom hook useTimeout with custom dependencies [...deps]
    //* wait 1/2 seconds
    const timeout = setTimeout(() => {
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
    }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, [selectedCards]);

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
