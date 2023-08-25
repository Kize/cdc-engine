import { JSX } from 'react';
import { SuiteModalResolver } from './SuiteModalResolver.tsx';
import { ChouetteVeluteModalResolver } from './ChouetteVeluteModalResolver.tsx';

export function RulesModals(): JSX.Element {
  return (
    <>
      <SuiteModalResolver />
      <ChouetteVeluteModalResolver />
    </>
  );
}
