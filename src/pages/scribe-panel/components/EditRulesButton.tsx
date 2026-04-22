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

export function EditRulesButton(): JSX.Element {
	const { isOpen, onOpen, onClose } = useDisclosure();
    const rulesConfiguration = useAppSelector(selectRulesConfiguration);
    const [rulesFrom, setRulesFrom] = useState(rulesConfiguration);
	const cancelRef = useRef(null);
	const dispatch = useAppDispatch();

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
							<Button ref={cancelRef} onClick={onClose}>
								Revenir en jeu
							</Button>

                            <Button
								colorScheme="green"
								onClick={async () => {
									await dispatch(updateGameRulesThunk(rulesFrom));
									onClose();
								}}
								ml={3}
							>
								Enregistrer les modifications
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
}
