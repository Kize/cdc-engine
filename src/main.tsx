import React from 'react';
import ReactDOM from 'react-dom/client';
import { CreateNewGame } from './pages/create-new-game/CreateNewGame.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ScribePanel } from './pages/scribe-panel/ScribePanel.tsx';
import { ChakraProvider } from '@chakra-ui/react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <CreateNewGame />,
  },
  {
    path: '/scribe-panel',
    element: <ScribePanel />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>,
);
