import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import LoginPage from './modules/auth/pages/LoginPage';
import Dashboard from './modules/templates/components/Dashboard';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import ListOrdersPage from './modules/orders/pages/ListOrdersPage';
import HomePage from './modules/home/pages/HomePage';
import ListProductsPage from './modules/products/pages/ListProductsPage';
import CreateProductPage from './modules/products/pages/CreateProductPage';
import ClientDashboard from './modules/templates/components/ClientDashboard';
import ShoppingCartPage from './modules/products/pages/ShoppingCartPage';
import CartItem from './modules/products/components/CartItem';
import ListProductCustomerPage from './modules/products/pages/ListProductCustomerPage';
import RegisterForm from './modules/auth/components/RegisterForm';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <><ClientDashboard /></>,
      children: [
        {
          path: '/',
          element: <ListProductCustomerPage  />,
        },
        {
          path: '/cart',
          element: <ShoppingCartPage />,
        },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/signup',
      element: <RegisterForm />,
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/admin/home',
          element: <HomePage />,
        },
        {
          path: '/admin/products',
          element: <ListProductsPage />,
        },
        {
          path: '/admin/products/create',
          element: <CreateProductPage />,
        },
        {
          path: '/admin/orders',
          element: <ListOrdersPage />,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
