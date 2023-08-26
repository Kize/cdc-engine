import { JSX } from 'react';
import { SuiteModalResolver } from './modals/SuiteModalResolver.tsx';
import { ChouetteVeluteModalResolver } from './modals/ChouetteVeluteModalResolver.tsx';
import { GrelottineModalResolver } from './modals/GrelottineModalResolver.tsx';

export function RulesModals(): JSX.Element {
  return (
    <>
      <GrelottineModalResolver />

      <SuiteModalResolver />
      <ChouetteVeluteModalResolver />
    </>
  );
}
