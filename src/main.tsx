import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { router } from './router.tsx';
import { HiddenImages } from './components/hidden-images/HiddenImages.tsx';

const container = document.getElementById('root');

createRoot(container!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <RouterProvider router={router} />
        <HiddenImages />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
);
