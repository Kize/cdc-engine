import { JSX } from 'react';
import { SuiteModalResolver } from '../modals/SuiteModalResolver.tsx';
import { ChouetteVeluteModalResolver } from '../modals/ChouetteVeluteModalResolver.tsx';
import { GrelottineModalResolver } from '../modals/GrelottineModalResolver.tsx';
import { ChanteSloubiModal } from '../modals/ChanteSloubiModal.tsx';
import { AddOperationsModal } from '../modals/AddOperationsModal.tsx';
import { ArtichetteModalResolver } from '../modals/ArtichetteModalResolver.tsx';
import { SouffletteModalResolver } from '../modals/SouffletteModalResolver.tsx';
import { EndGameModal } from '../modals/EndGameModal.tsx';

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

      <EndGameModal />
    </>
  );
}
