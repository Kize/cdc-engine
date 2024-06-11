import {
	Button,
	ButtonGroup,
	FormControl,
	FormLabel,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalOverlay,
} from "@chakra-ui/react";
import { type JSX, useState } from "react";
import { BevueModalHeader } from "../../../../components/custom-modal/BevueModalHeader.tsx";
import { OneLineDiceForm } from "../../../../components/dice/OneLineDiceForm.tsx";
import {
	type DiceForm,
	isDiceFormValid,
} from "../../../../components/dice/dice-form.ts";
import { robobrolRuleResolver } from "../../../../store/resolvers/rules/robobrol-rule.resolver.ts";
import { useAppSelector } from "../../../../store/store.ts";

export function RobobrolModalResolver(): JSX.Element {
	const { active, player } = useAppSelector(
		(state) => state.resolvers.robobrol,
	);
	const [diceForm, setDiceForm] = useState<DiceForm>([null, null, null]);

	const onClose = () => {
		robobrolRuleResolver.reject();
		setDiceForm([null, null, null]);
	};

	const onValidate = () => {
		if (isDiceFormValid(diceForm)) {
			robobrolRuleResolver.resolve({ diceRoll: diceForm });
			setDiceForm([null, null, null]);
		}
	};

	return (
		<Modal closeOnOverlayClick={false} isOpen={active} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<BevueModalHeader
					title={`Saisie de la relance du robobrol de ${player}`}
				/>

				<ModalBody>
					<FormControl>
						<FormLabel fontSize={"sm"}>Relance du Robobrol:</FormLabel>

						<OneLineDiceForm
							diceForm={diceForm}
							onChangeForm={(diceForm) => setDiceForm(diceForm)}
						/>
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<ButtonGroup>
						<Button onClick={onClose}>Annuler</Button>

						<Button
							colorScheme="blue"
							onClick={onValidate}
							isDisabled={!isDiceFormValid(diceForm)}
						>
							Valider
						</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
