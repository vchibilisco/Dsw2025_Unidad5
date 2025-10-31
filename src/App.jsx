import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './modules/auth/pages/LoginPage';
import ListOrdersPage from './modules/orders/pages/ListOrdersPage';

function App() {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/orders',
      element: <ListOrdersPage />,
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
