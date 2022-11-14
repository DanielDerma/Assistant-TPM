import { Box, Container, Divider, FormControl, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import {
  AppCurrentVisits,
  AppWebsiteVisits,
  AppConversionRates,
  BankingWidgetSummary,
} from '../sections/@dashboard/app';
import Page from '../components/Page';
import { getCompanies, getSubCollectionErrors } from '../services/firebaseFunctions';

const App = ({ isAdmin }) => {
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [input, setInput] = useState(Cookies.get('companyFocus') || '');
  const [data, setData] = useState([]);

  const thisYear = new Date().getFullYear();
  // firebase date in between 1-12 and js date in between 0-11, we will work in firebase date
  const thisMonth = new Date().getMonth() + 1;

  const theme = useTheme();

  useEffect(() => {
    if (isAdmin) {
      setLoadingBtn(true);
      getCompanies().then((data) => {
        setMenuItems(data);
        setLoadingBtn(false);
      });
    }
  }, [isAdmin]);

  useEffect(() => {
    if (input) {
      getErrors(input);
    }
  }, [input]);

  const getErrors = (input) => {
    if (input === '') return;
    console.log('getErrors', input);
    setLoading(true);
    getSubCollectionErrors(input).then((data) => {
      setData(data);
      setLoading(false);
    });
  };

  const handleInput = (event) => {
    console.log('entre handleinput');
    Cookies.set('companyFocus', event.target.value);
    setInput(event.target.value);
    getErrors(event.target.value);
  };

  const filterDataF = (data, thisYear) => {
    const byDate = data.reduce((acc, curr) => {
      const dateStringSeparate = curr.dateAndTime.toDate().toISOString().split('-');
      const keyYear = dateStringSeparate[0];
      const keyMonth = dateStringSeparate[1];

      return { ...acc, [keyYear]: { ...acc[keyYear], [keyMonth]: [...(acc[keyYear]?.[keyMonth] || []), curr] } };
    }, {});

    const byDateCounterType = Object.entries(byDate[thisYear]).reduce((acc, [keyMonth, value]) => {
      const counter = value.reduce((acc, curr) => ({ ...acc, [curr.type]: (acc[curr.type] || 0) + 1 }), {});
      return { ...acc, [keyMonth]: { ...acc[keyMonth], ...counter } };
    }, {});

    return byDateCounterType;
  };

  const filterData = useMemo(() => {
    if (data.length > 0 && !loading) {
      const thisYearData = filterDataF(data, thisYear);
      const thisMonthData = thisYearData[thisMonth];

      return { thisYear: thisYearData, thisMonth: thisMonthData };
    }
    return {};
  }, [data, loading]);

  const maintenance = filterData?.thisMonth?.maintenance || 0;
  const operation = filterData?.thisMonth?.operation || 0;
  const security = filterData?.thisMonth?.security || 0;

  console.log({ maintenance, operation, security });
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
                Tortillería La Salle
              </Typography>
            )}
          </Box>

          <Grid container spacing={3}>
            {input && (
              <>
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
                      { label: 'Mantenimiento', value: maintenance },
                      { label: 'Operación', value: operation },
                      { label: 'Seguridad', value: security },
                    ]}
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
