import { useEffect, useState } from 'react';

function getStorageValue<T extends Record<string, unknown> | Array<unknown>>(
  key: string,
  defaultValue: T,
): T {
  const saved = localStorage.getItem(key);

  if (!saved) {
    return defaultValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(saved) || defaultValue;
}

export const useLocalStorage = <
  T extends Record<string, unknown> | Array<unknown>,
>(
  key: string,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState(() => {
    return getStorageValue<T>(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
