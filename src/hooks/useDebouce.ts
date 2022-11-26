import { useEffect, useState } from 'react';

export const useDebounce = <T>({ ms, value }: { ms?: number; value: T }) => {
  const [debouncedValue, setDebouncedValue] = useState<typeof value>(value);

  useEffect(() => {
    const updateValue = (): void => setDebouncedValue(value);
    const timeout: number = setTimeout(updateValue, ms);

    return () => {
      clearTimeout(timeout);
    };
  }, [ms, value]);

  return debouncedValue;
};
