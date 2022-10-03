import { useState } from 'react';
import { Grid, Container, Typography } from '@mui/material';
import FormAdd from '../components/FormAdd';
// @mui
// components
import Page from '../components/Page';

// sections
import { AppWidgetSummary } from '../sections/@dashboard/add';

// ----------------------------------------------------------------------

const cards = [
  {
    title: 'Mantenimiento',
    type: 'maintenance',
    icon: 'ant-design:bug-filled',
    color: 'error',
  },
  {
    title: 'Operación',
    type: 'operation',
    icon: 'ant-design:setting-filled',
    color: 'info',
  },
  {
    title: 'Seguridad',
    type: 'security',
    icon: 'ant-design:security-scan-filled',
    color: 'success',
  },
];

export default function DashboardApp() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState({});

  const handleClose = () => setOpen(false);

  const handleTitle = (title) => setTitle(title);
  const handleOpen = () => setOpen(true);

  return (
    <Page title="Añadir">
      <FormAdd onClose={handleClose} open={open} title={title} />
      <Container maxWidth="xl">
        <Typography variant="h4">Hola, Bienvenido</Typography>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Selecciona una tarjeta si es requerido.
        </Typography>

        <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ minHeight: 400 }}>
          {cards.map(({ title, type, icon, color }) => (
            <Grid item xs={12} sm={6} md={4} key={type}>
              <AppWidgetSummary
                onOpen={handleOpen}
                onTitle={handleTitle}
                title={title}
                type={type}
                icon={icon}
                color={color}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
