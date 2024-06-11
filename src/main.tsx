import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { HiddenImages } from "./components/hidden-images/HiddenImages.tsx";
import { router } from "./router.tsx";
import { store } from "./store/store.ts";
import { theme } from "./theming/theme.ts";

const container = document.getElementById("root");

createRoot(container!).render(
	<React.StrictMode>
		<Provider store={store}>
			<ChakraProvider theme={theme}>
				<RouterProvider router={router} />
				<HiddenImages />
			</ChakraProvider>
		</Provider>
	</React.StrictMode>,
);
