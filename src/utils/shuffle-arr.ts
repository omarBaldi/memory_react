export const shuffleArr = <T>(arr: T[]): T[] => {
  const updatedArr: typeof arr = [...arr];

  for (let i = updatedArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [updatedArr[i], updatedArr[j]] = [updatedArr[j], updatedArr[i]];
  }

  return updatedArr;
};
