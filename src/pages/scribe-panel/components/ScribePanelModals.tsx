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

export function ScribePanelModals(): JSX.Element {
  return (
    <>
      <AddOperationsModal />
      <ChanteSloubiModal />
      <GrelottineModalResolver />

      <SuiteModalResolver />
      <ChouetteVeluteModalResolver />

      <ArtichetteModalResolver />
      <SouffletteModalResolver />
      <SiropModalResolver />
      <BleuRougeModalResolver />

      <EndGameModal />
    </>
  );
}
