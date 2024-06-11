import { Image } from "@chakra-ui/react";
import type { JSX } from "react";
import { getAllImages } from "./images.ts";

/*
 * Ensures gifs are loaded in case the client has no internet connection when accessing the end game modal
 */
export function HiddenImages(): JSX.Element {
	const imageUrls = getAllImages();
	return (
		<>
			{imageUrls.map((url) => (
				<Image src={url} key={url} display="none" />
			))}
		</>
	);
}
