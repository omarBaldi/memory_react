import { useEffect, useMemo, useRef, useState } from 'react';
import { v4 as v4Id } from 'uuid';
import './App.css';
import { shuffleArr } from './utils/shuffle-arr';

/**
 *
 * * The total number of cards has to be an EVEN number
 * * as every card is associated to another one. (set of 2 cards)
 *
 * * As soon as a card is clicked I need to reveal on the web view
 * * As soon as the second card is clicked, follow the step described
 * * in the line above and:
 * * - check if the 2 cards belong to the same pair
 * *  - if that's the case, store the selected cards
 * * - wait 1/2 seconds
 * * - reset the cards clicked
 */

type ApiResponseType = {
  message: string;
  status: string;
};

function App() {
  //TODO: move magic number to descriptive constant variable
  const totalAmountCards = useRef<number>(16);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    //TODO: move API endpoint to env variable and constant as fallback
    const apiEndpoint = 'https://dog.ceo/api/breeds/image/random';
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

  /* if the current card is amongst the one clicked then
  set that to "selected" */

  //Map<cardId, setId>

  return (
    <div className='App'>
      <div className='wrapper'>
        <div className='memory__grid'>
          {memoryCardsData.map(({ imageSrc, setId }, index: number) => {
            return (
              <div key={`card-${index}-${setId}`} className='memory__card'>
                <img src={imageSrc} alt='' className='memory__card__img' />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
