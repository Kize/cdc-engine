import { extendTheme } from "@chakra-ui/react";
import { radioTheme } from "./radio.theme.ts";

export const theme = extendTheme({
	components: {
		Radio: radioTheme,
	},
});
