import { useCallback, useRef } from 'react';
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
function App() {
  //TODO: move magic number to descriptive constant variable
  const totalAmountCards = useRef<number>(16);

  /* if the current card is amongst the one clicked then
  set that to "selected" */

  //Map<cardId, setId>

  const memoryGridRef = useCallback((el: HTMLDivElement) => {
    if (el) {
      //TODO: check if the totalAmount of cards is an even number

      //Considering the fact that there has to be a pair of 2
      //the images will have to be half the total amount of cards
      const amountCardsSet: number = totalAmountCards.current / 2;

      const setIds: string[] = [...Array(amountCardsSet)].map(() => v4Id());
      const totalAmountSetIds = [...setIds, ...setIds];

      const memoryCardsElement = totalAmountSetIds.reduce<HTMLDivElement[]>(
        (acc, setId: string, index: number) => {
          const cardLabel: string = (index + 1).toString();

          const cardElement: HTMLDivElement = document.createElement('div');
          cardElement.className = 'memory__card';
          cardElement.innerText = cardLabel;
          cardElement.dataset.setid = setId;

          acc.push(cardElement);

          return acc;
        },
        []
      );

      for (const card of shuffleArr(memoryCardsElement)) {
        el.appendChild(card);
      }
    }
  }, []);

  return (
    <div className='App'>
      <div className='wrapper'>
        <div className='memory__grid' ref={memoryGridRef} />
      </div>
    </div>
  );
}

export default App;
