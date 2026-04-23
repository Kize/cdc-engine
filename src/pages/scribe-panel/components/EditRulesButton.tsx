import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	useDisclosure,
} from "@chakra-ui/react";
import { type JSX, useRef, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { updateGameRulesThunk } from "../../../store/current-game/current-game-lifecycle-thunks.ts";
import { useAppDispatch, useAppSelector } from "../../../store/store.ts";
import { RulesSelectionPanel } from "../../create-new-game/RulesSelectionPanel.tsx";
import { selectRulesConfiguration } from "../../../store/current-game/current-game-selectors.ts";
import type { RulesConfiguration } from "../../../../lib/rule-runner/rule-runner-configuration.ts";

interface Props {
	onCloseScribeDrawer?: () => void;
}

export function EditRulesButton({ onCloseScribeDrawer }: Props): JSX.Element {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const rulesConfiguration = useAppSelector(selectRulesConfiguration);
	const [rulesFrom, setRulesFrom] = useState(rulesConfiguration);
	const cancelRef = useRef(null);
	const dispatch = useAppDispatch();

	const isRulesDisabled = (
		Object.keys(rulesConfiguration) as Array<keyof RulesConfiguration>
	).every((key) => rulesFrom[key] === rulesConfiguration[key]);

	const handleUpdateRules = async () => {
		await dispatch(updateGameRulesThunk(rulesFrom));
		handleClose();
	}

	const handleClose = () => {
		onClose();
		onCloseScribeDrawer?.();
	};

	return (
		<>
			<Button
				colorScheme="purple"
				leftIcon={<MdModeEdit />}
				onClick={onOpen}
			>
				Modifier les règles
			</Button>

			<AlertDialog
				isOpen={isOpen}
				closeOnOverlayClick={false}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Modifier les règles
						</AlertDialogHeader>

						<AlertDialogBody>
							<RulesSelectionPanel rules={rulesFrom} setRules={setRulesFrom} />
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={handleClose}>
								Revenir en jeu
							</Button>

							<Button
								isDisabled={isRulesDisabled}
								colorScheme="green"
								onClick={handleUpdateRules}
								ml={3}
							>
								Valider
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
}
