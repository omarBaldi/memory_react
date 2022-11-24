import { FC } from 'react';
import MemoryCardProps from './dto';

const MemoryCard: FC<MemoryCardProps> = ({
  id,
  imageSrc,
  setId,
  isCardSelected,
  hasBeenGuessed,
  handleCardClick,
}: MemoryCardProps) => {
  return (
    <div
      className={`memory__card ${hasBeenGuessed ? 'guessed' : ''}`}
      onClick={() =>
        hasBeenGuessed
          ? undefined
          : handleCardClick({
              cardId: id,
              cardSetId: setId,
            })
      }
    >
      {isCardSelected && (
        <img src={imageSrc} alt='' className='memory__card__img' />
      )}
    </div>
  );
};

export default MemoryCard;
