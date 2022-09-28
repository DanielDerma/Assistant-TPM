// @mui
import { Grid, Container, Typography } from '@mui/material';
import { AddProvider } from '../hooks/useAddPage';
// components
import Page from '../components/Page';
// sections
import { AppWidgetSummary, Stepper } from '../sections/@dashboard/add';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Añadir">
      <AddProvider>
        <Stepper />
        <Container maxWidth="xl">
          <Typography variant="h4">Hola, Bienvenido.</Typography>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Selecciona una tarjeta si se requiere.
          </Typography>

          <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ minHeight: 400 }}>
            <Grid item xs={12} sm={6} md={4}>
              <AppWidgetSummary title="Mantenimiento" icon={'ant-design:bug-filled'} color="error" />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <AppWidgetSummary title="Operación" color="info" icon={'ant-design:setting-filled'} />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <AppWidgetSummary title="Seguridad" color="success" icon={'ant-design:security-scan-filled'} />
            </Grid>
          </Grid>
        </Container>
      </AddProvider>
    </Page>
  );
}
