import type { JSX } from "react";
import { AddOperationsModal } from "../modals/AddOperationsModal.tsx";
import { ChanteSloubiModal } from "../modals/ChanteSloubiModal.tsx";
import { EndGameModal } from "../modals/EndGameModal.tsx";
import { ArtichetteModalResolver } from "../modals/resolvers/ArtichetteModalResolver.tsx";
import { BleuRougeModalResolver } from "../modals/resolvers/BleuRougeModalResolver.tsx";
import { ChouetteVeluteModalResolver } from "../modals/resolvers/ChouetteVeluteModalResolver.tsx";
import { CivetModalResolver } from "../modals/resolvers/CivetModalResolver.tsx";
import { CulDeChouetteModalResolver } from "../modals/resolvers/CulDeChouetteModalResolver.tsx";
import { GrelottineModalResolver } from "../modals/resolvers/GrelottineModalResolver.tsx";
import { RobobrolModalResolver } from "../modals/resolvers/RobobrolModalResolver.tsx";
import { SiropModalResolver } from "../modals/resolvers/SiropModalResolver.tsx";
import { SouffletteModalResolver } from "../modals/resolvers/SouffletteModalResolver.tsx";
import { SuiteModalResolver } from "../modals/resolvers/SuiteModalResolver.tsx";
import { TichetteModalResolver } from "../modals/resolvers/TichetteModalResolver.tsx";
import { VerdierModalResolver } from "../modals/resolvers/VerdierModalResolver.tsx";

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
