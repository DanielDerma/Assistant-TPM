import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import ManageLayout from './layouts/ManageLayout';
//
import Filter from './pages/Filter';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Export from './pages/Export';
import Add from './pages/Add';
import App from './pages/App';
import Admin from './pages/Admin';
import Companies from './pages/Companies';
import SubItems from './pages/SubItems';
import useAuth from './hooks/useAuth';

// ----------------------------------------------------------------------

export default function Router() {
  const { isAuthenticated, isAdmin } = useAuth();

  return useRoutes([
    {
      path: '/dashboard',
      element: isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        {
          element: <Navigate to="/dashboard/add" replace />,
          index: true,
        },
        { path: 'add', element: <Add /> },
        { path: 'filter', element: <Filter /> },
        { path: 'export', element: <Export /> },
        { path: 'app', element: <App isAdmin={isAdmin} /> },
        { path: 'admin', element: isAdmin ? <Admin /> : <Navigate to="/404" /> },
        {
          path: 'manage',
          element: isAdmin ? <ManageLayout /> : <Navigate to="/404" />,
          children: [
            { element: <Companies />, index: true },
            { path: '*', element: <SubItems /> },
          ],
        },
      ],
    },
    {
      path: 'login',
      element: !isAuthenticated ? <Login /> : <Navigate to="/dashboard/add" />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/add" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
