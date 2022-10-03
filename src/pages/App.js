import { Box, Container, Divider, FormControl, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

import { faker } from '@faker-js/faker';
import Iconify from '../components/Iconify';

import {
  AppCurrentVisits,
  AppWebsiteVisits,
  AppConversionRates,
  BankingWidgetSummary,
} from '../sections/@dashboard/app';
import Page from '../components/Page';

const App = () => {
  const theme = useTheme();
  const [input, setInput] = useState(10);
  const handleInput = (event) => setInput(event.target.value);
  return (
    <div>
      <Page title="Dashboard">
        <Container maxWidth="xl">
          <Box>
            <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 5 }}>
              <Typography variant="h4">Selecciona una Compañía:</Typography>
              <FormControl sx={{ minWidth: 250 }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select-label"
                  variant="standard"
                  sx={{ fontSize: 20 }}
                  label="Compañía"
                  value={input}
                  onChange={handleInput}
                >
                  <MenuItem value={10}>Tortillería la Salle</MenuItem>
                  <MenuItem value={20}>Empresa 1</MenuItem>
                  <MenuItem value={30}>Empresa 2</MenuItem>
                  <MenuItem value={40}>Empresa 3</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <BankingWidgetSummary
                  title="Mantenimiento"
                  icon={'ant-design:bug-filled'}
                  percent={2.6}
                  total={18765}
                  color="error"
                  chartData={[111, 136, 76, 108, 74, 54, 57, 84]}
                />
                <BankingWidgetSummary
                  title="Operación"
                  color="info"
                  icon={'ant-design:setting-filled'}
                  percent={-0.5}
                  total={8938}
                  chartData={[111, 136, 76, 108, 74, 54, 57, 84]}
                />
                <BankingWidgetSummary
                  title="Seguridad"
                  color="success"
                  icon={'ant-design:security-scan-filled'}
                  percent={-0.5}
                  total={8938}
                  chartData={[111, 136, 76, 108, 74, 54, 57, 84]}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
              <AppWebsiteVisits
                title="Tarjetas en lo que va del año"
                subheader="(-43%) que el año pasado"
                chartLabels={[
                  '01/01/2003',
                  '02/01/2003',
                  '03/01/2003',
                  '04/01/2003',
                  '05/01/2003',
                  '06/01/2003',
                  '07/01/2003',
                  '08/01/2003',
                  '09/01/2003',
                  '10/01/2003',
                  '11/01/2003',
                ]}
                chartData={[
                  {
                    name: 'Mantenimiento',
                    type: 'column',
                    fill: 'solid',
                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                  },
                  {
                    name: 'Operación',
                    type: 'area',
                    fill: 'gradient',
                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                  },
                  {
                    name: 'Seguridad',
                    type: 'line',
                    fill: 'solid',
                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                  },
                ]}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <AppCurrentVisits
                title="Tarjetas de este Mes"
                chartData={[
                  { label: 'Mantenimiento', value: 4344 },
                  { label: 'Operación', value: 5435 },
                  { label: 'Seguridad', value: 1443 },
                ]}
                chartColors={[theme.palette.error.main, theme.palette.info.main, theme.palette.success.main]}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12} sx={{ my: 2 }}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <AppConversionRates
                title="Numero de Tarjetas por Compañía en total"
                chartData={[
                  { label: 'Empresa 1', value: 400 },
                  { label: 'Empresa 2', value: 430 },
                  { label: 'Empresa 3', value: 448 },
                  { label: 'Empresa 4', value: 470 },
                  { label: 'Empresa 5', value: 540 },
                  { label: 'Empresa 6', value: 580 },
                  { label: 'Empresa 7', value: 690 },
                  { label: 'Empresa 8', value: 1100 },
                  { label: 'Empresa 9', value: 1200 },
                  { label: 'Empresa 10', value: 1380 },
                ]}
              />
            </Grid>
          </Grid>
        </Container>
      </Page>
    </div>
  );
};

export default App;
