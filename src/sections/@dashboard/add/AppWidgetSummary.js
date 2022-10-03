// @mui
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Card, CardActionArea, Typography } from '@mui/material';
// components
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  sx: PropTypes.object,
  onOpen: PropTypes.func,
  onTitle: PropTypes.func,
};

export default function AppWidgetSummary({ title, type, icon, color = 'primary', sx, onOpen, onTitle, ...other }) {
  const handleOpen = () => {
    onOpen();
    onTitle({ title, type });
  };
  return (
    <Card>
      <CardActionArea
        sx={{
          height: 270,
          py: 5,
          boxShadow: 0,
          textAlign: 'center',
          color: (theme) => theme.palette[color].darker,
          bgcolor: (theme) => theme.palette[color].light,
          ...sx,
        }}
        {...other}
        onClick={handleOpen}
      >
        <IconWrapperStyle
          sx={{
            color: (theme) => theme.palette[color].dark,
            backgroundImage: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
                theme.palette[color].dark,
                0.24
              )} 100%)`,
          }}
        >
          <Iconify icon={icon} width={24} height={24} />
        </IconWrapperStyle>

        <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
          {title}
        </Typography>
      </CardActionArea>
    </Card>
  );
}
