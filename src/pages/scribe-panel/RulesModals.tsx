import { JSX } from 'react';
import { SuiteModalResolver } from './modals/SuiteModalResolver.tsx';
import { ChouetteVeluteModalResolver } from './modals/ChouetteVeluteModalResolver.tsx';
import { GrelottineModalResolver } from './modals/GrelottineModalResolver.tsx';
import { ChanteSloubiModal } from './modals/ChanteSloubiModal.tsx';

export function RulesModals(): JSX.Element {
  return (
    <>
      <ChanteSloubiModal />
      <GrelottineModalResolver />

      <SuiteModalResolver />
      <ChouetteVeluteModalResolver />
    </>
  );
}
