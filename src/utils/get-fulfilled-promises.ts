/**
 *
 * @param {Array} promises array of promises
 * @returns an array containing the promises data
 */
export const getFulfilledPromises = async <T>({
  promises,
}: {
  promises: Promise<T>[];
}): Promise<T[]> => {
  const promisesData = (await Promise.allSettled(promises))
    .filter(({ status }) => status === 'fulfilled')
    .map((p) => (p as PromiseFulfilledResult<T>).value);

  return promisesData;
};
