// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfigTechnical = [
  {
    title: 'Añadir',
    path: '/dashboard/add',
    icon: getIcon('eva:plus-square-fill'),
  },
  {
    title: 'Filtrado',
    path: '/dashboard/filter',
    icon: getIcon('eva:funnel-fill'),
  },
  {
    title: 'Exportar',
    path: '/dashboard/export',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'Dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
];

const navConfigAdmin = [
  {
    title: 'Admin',
    path: '/dashboard/admin',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Modificar',
    path: '/dashboard/modify',
    icon: getIcon('eva:file-add-fill'),
  },
];

export { navConfigTechnical, navConfigAdmin };
