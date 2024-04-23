import { JSX } from 'react';
import { SuiteModalResolver } from '../modals/resolvers/SuiteModalResolver.tsx';
import { ChouetteVeluteModalResolver } from '../modals/resolvers/ChouetteVeluteModalResolver.tsx';
import { GrelottineModalResolver } from '../modals/resolvers/GrelottineModalResolver.tsx';
import { ChanteSloubiModal } from '../modals/ChanteSloubiModal.tsx';
import { AddOperationsModal } from '../modals/AddOperationsModal.tsx';
import { ArtichetteModalResolver } from '../modals/resolvers/ArtichetteModalResolver.tsx';
import { SouffletteModalResolver } from '../modals/resolvers/SouffletteModalResolver.tsx';
import { EndGameModal } from '../modals/EndGameModal.tsx';
import { SiropModalResolver } from '../modals/resolvers/SiropModalResolver.tsx';
import { BleuRougeModalResolver } from '../modals/resolvers/BleuRougeModalResolver.tsx';
import { CivetModalResolver } from '../modals/resolvers/CivetModalResolver.tsx';
import { CulDeChouetteModalResolver } from '../modals/resolvers/CulDeChouetteModalResolver.tsx';
import { VerdierModalResolver } from '../modals/resolvers/VerdierModalResolver.tsx';
import { TichetteModalResolver } from '../modals/resolvers/TichetteModalResolver.tsx';
import { RobobrolModalResolver } from '../modals/resolvers/RobobrolModalResolver.tsx';

export function ScribePanelModals(): JSX.Element {
  return (
    <>
      <AddOperationsModal />
      <ChanteSloubiModal />
      <GrelottineModalResolver />

      <CulDeChouetteModalResolver />
      <SuiteModalResolver />
      <ChouetteVeluteModalResolver />

      <ArtichetteModalResolver />
      <SouffletteModalResolver />
      <SiropModalResolver />
      <CivetModalResolver />
      <BleuRougeModalResolver />

      <VerdierModalResolver />
      <TichetteModalResolver />
      <RobobrolModalResolver />

      <EndGameModal />
    </>
  );
}
