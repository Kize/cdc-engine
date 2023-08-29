import { JSX } from 'react';
import { Image } from '@chakra-ui/react';
import { getAllImages } from './images.ts';

/*
 * Ensures gifs are loaded in case the client has no internet connection when accessing the end game modal
 */
export function HiddenImages(): JSX.Element {
  const imageUrls = getAllImages();
  return (
    <>
      {imageUrls.map((url, index) => (
        <Image src={url} key={index} display="none" />
      ))}
    </>
  );
}
