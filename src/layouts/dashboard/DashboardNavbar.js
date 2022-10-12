import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@mui/material';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';

// components
import Iconify from '../../components/Iconify';
import AccountPopover from './AccountPopover';
import useResponsive from '../../hooks/useResponsive';
//

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: 'transparent',
  [theme.breakpoints.up('lg')]: {
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none', // Fix on Mobile
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const isDesktop = useResponsive('up', 'lg');
  const trigger = useScrollTrigger({ disableHysteresis: isDesktop, threshold: 0 });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <RootStyle>
        <ToolbarStyle>
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}>
            <Iconify icon="eva:menu-2-fill" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
            <AccountPopover />
          </Stack>
        </ToolbarStyle>
      </RootStyle>
    </Slide>
  );
}
