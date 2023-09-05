interface Flavoring<FlavorT> {
  _type?: FlavorT;
}
export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;

export type Player = Flavor<string, 'Player'>;

export function sortPlayersStartingBy(
  players: Array<Player>,
  sirotant: Player,
): Array<Player> {
  if (!sirotant) {
    return [];
  }

  const sirotantIndex = players.findIndex((p) => p === sirotant);

  const firstPart = players.slice(0, sirotantIndex);
  const secondPart = players.slice(sirotantIndex);
  return [...secondPart, ...firstPart];
}
