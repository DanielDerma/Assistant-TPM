import { useState } from 'react';
import { Grid, Container, Typography } from '@mui/material';
import { AddCard } from '../components/ModalForm/add';
// @mui
// components
import Page from '../components/Page';

import { AppWidgetSummary } from '../sections/@dashboard/add';
import Alert from '../components/Alert';

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
  const [openAlert, setOpenAlert] = useState(false);
  const [idPreview, setIdPreview] = useState(0);
  const [title, setTitle] = useState({});

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleCloseAlert = () => setOpenAlert(false);
  const handleOpenAlert = (id) => {
    setIdPreview(id);
    setOpenAlert(true);
  };

  const handleTitle = (title) => setTitle(title);

  return (
    <Page title="Añadir">
      <AddCard onClose={handleClose} open={open} title={title} onConfirm={handleOpenAlert} />
      <Alert
        open={openAlert}
        onClose={handleCloseAlert}
        severity="success"
      >{`Creado con éxito, Folio: ${idPreview}`}</Alert>
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
