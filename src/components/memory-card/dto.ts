type MemoryCardProps = {
  imageSrc: string;
  id: string;
  setId: string;
  isCardSelected: boolean;
  hasBeenGuessed: boolean;
  handleCardClick: ({
    cardId,
    cardSetId,
  }: {
    cardId: string;
    cardSetId: string;
  }) => void;
};

export default MemoryCardProps;
