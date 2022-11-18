import { Box, Container, Divider, FormControl, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  AppCurrentVisits,
  AppWebsiteVisits,
  AppConversionRates,
  BankingWidgetSummary,
} from '../sections/@dashboard/app';
import Page from '../components/Page';
import { getCompanies, getErrorsCount } from '../services/firebaseFunctions';
import useAuth from '../hooks/useAuth';

const App = ({ isAdmin }) => {
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [input, setInput] = useState('');
  const [data, setData] = useState([]);

  const {
    company: { title, id: companyId },
  } = useAuth();

  const thisYear = new Date().getFullYear();

  const theme = useTheme();

  useEffect(() => {
    if (isAdmin) {
      setLoadingBtn(true);
      getCompanies().then((data) => {
        setMenuItems(data);
        setLoadingBtn(false);
      });
    } else {
      getErrors(companyId, thisYear);
    }
  }, [isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  const getErrors = (input) => {
    if (input === '') return;
    setLoading(true);
    getErrorsCount(input, thisYear).then((data) => {
      setData(data);
      setLoading(false);
    });
  };

  const handleInput = (event) => {
    const { id } = menuItems.filter((item) => item.label === event.target.value);
    setInput(event.target.value);
    getErrors(id);
  };

  console.log(data);

  return (
    <div>
      <Page title="Dashboard">
        <Container maxWidth="xl">
          <Box>
            {isAdmin ? (
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
                    {[
                      <MenuItem value="" key="null">
                        <em>Ninguno</em>
                      </MenuItem>,
                      !loadingBtn &&
                        menuItems.map((item) => (
                          <MenuItem key={item.id} value={item.title}>
                            {item.title}
                          </MenuItem>
                        )),
                    ]}
                  </Select>
                </FormControl>
              </Stack>
            ) : (
              <Typography variant="h4" mb={5}>
                {title}
              </Typography>
            )}
          </Box>

          <Grid container spacing={3}>
            {!loading && (
              <>
                <Grid item xs={12} md={12}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <BankingWidgetSummary
                      title="Mantenimiento"
                      icon={'ant-design:bug-filled'}
                      percent={-2.6}
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
                      '01/01/2022',
                      '02/01/2022',
                      '03/01/2022',
                      '04/01/2022',
                      '05/01/2022',
                      '06/01/2022',
                      '07/01/2022',
                      '08/01/2022',
                      '09/01/2022',
                      '10/01/2022',
                      '11/01/2022',
                    ]}
                    chartData={[
                      {
                        name: 'Mantenimiento',
                        type: 'column',
                        fill: 'solid',
                        data: [111, 136, 76, 108, 74, 54, 57, 84, 32, 23, 12, 32],
                      },
                      {
                        name: 'Operación',
                        type: 'area',
                        fill: 'gradient',
                        data: [32, 12, 23, 32, 84, 57, 54, 74, 108, 76, 136, 111],
                      },
                      {
                        name: 'Seguridad',
                        type: 'line',
                        fill: 'solid',
                        data: [32, 12, 12, 32, 84, 57, 54, 23, 108, 76, 136, 111],
                      },
                    ]}
                  />
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                  <AppCurrentVisits
                    title="Tarjetas de este Mes"
                    // chartData={chartDataMonth}
                    chartColors={[theme.palette.error.main, theme.palette.info.main, theme.palette.success.main]}
                  />
                </Grid>
              </>
            )}

            {isAdmin && (
              <>
                <Grid item xs={12} md={12} lg={12} sx={{ my: 2 }}>
                  <Divider />
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                  <AppConversionRates
                    title="Numero de Tarjetas por Compañía en total"
                    chartData={[
                      { label: 'Empresa 1' },
                      { label: 'Empresa 2' },
                      { label: 'Empresa 3' },
                      { label: 'Empresa 4' },
                      { label: 'Empresa 5' },
                      { label: 'Empresa 6' },
                      { label: 'Empresa 7' },
                    ]}
                    series={[
                      {
                        name: 'Mantenimiento',
                        data: [44, 55, 41, 37, 22, 43, 21],
                      },
                      {
                        name: 'Operación',
                        data: [53, 32, 33, 52, 13, 43, 32],
                      },
                      {
                        name: 'Seguridad',
                        data: [12, 17, 11, 9, 15, 11, 20],
                      },
                    ]}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Container>
      </Page>
    </div>
  );
};

App.propTypes = {
  isAdmin: PropTypes.bool,
};

export default App;
