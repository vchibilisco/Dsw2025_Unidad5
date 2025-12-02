import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import LoginPage from './modules/auth/pages/LoginPage';
import Dashboard from './modules/templates/components/Dashboard';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import ListOrdersPage from './modules/orders/pages/ListOrdersPage';
import Home from './modules/home/pages/Home';
import ListProductsPage from './modules/products/pages/ListProductsPage';
import CreateProductPage from './modules/products/pages/CreateProductPage';
import RegisterPage from './modules/auth/pages/RegisterPage';
import Header from './modules/templates/components/Header';
import ListProductMainPage from './modules/products/pages/ListProductMainPage';
import Cart from './modules/cart/Cart';
import CheckoutPage from './modules/orders/pages/CheckoutPage';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        // Layout principal para la parte pública (Cliente)
        <>
          <Header />
          <main className="container mx-auto p-4">
            {/* EL OUTLET ES CRUCIAL: Aquí se muestran el catálogo o el carrito */}
            <Outlet />
          </main>
        </>
      ),
      children: [
        {
          path: '/',
          element: <ListProductMainPage />,
        },
        {
          path: '/cart',
          element: <Cart />,
        },
        {
          path: '/checkout', 
          element: <CheckoutPage />,
        },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/singup',
      element: <RegisterPage />,
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
          element: <Home />,
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
