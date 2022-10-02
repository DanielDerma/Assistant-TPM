import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Filter from './pages/Filter';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Export from './pages/Export';
import Add from './pages/Add';
import App from './pages/App';
import Admin from './pages/Admin';
import Locations from './pages/Locations';
import Location from './pages/Location';
import Area from './pages/Area';
import Workspace from './pages/Workspace';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/add" replace />, index: true },
        { path: 'add', element: <Add /> },
        { path: 'filter', element: <Filter /> },
        { path: 'export', element: <Export /> },
        { path: 'app', element: <App /> },
        { path: 'admin', element: <Admin /> },
        {
          path: 'manage',
          children: [
            { element: <Navigate to="/dashboard/manage/locations" replace />, index: true },
            { path: 'locations', element: <Locations /> },
            { path: ':location', element: <Location /> },
            { path: ':location/:area', element: <Area /> },
            { path: ':location/:area/:workspace', element: <Workspace /> },
          ],
        },
      ],
    },
    {
      path: 'login',
      element: <Login />,
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
