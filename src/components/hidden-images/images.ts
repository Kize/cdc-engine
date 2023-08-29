const imageNames = [
  'bed.gif',
  'clap.gif',
  'clap2.gif',
  'count.webp',
  'dance.gif',
  'strong.webp',
];

export const getAllImages = () => {
  return imageNames.map(
    (name) => new URL(`../../../public/${name}`, import.meta.url).href,
  );
};

export const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * (imageNames.length - 1) + 1);

  return new URL(`../../../public/${imageNames[randomIndex]}`, import.meta.url)
    .href;
};
