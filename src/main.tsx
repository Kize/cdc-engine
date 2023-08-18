import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ScribePanel } from './pages/scribe-panel/ScribePanel.tsx';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from './store.ts';

const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element: <CreateNewGame />,
  // },
  {
    path: '/scribe-panel',
    element: <ScribePanel />,
  },
]);

const container = document.getElementById('root');

createRoot(container!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
);
