import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Box, Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
// components
import { BaseOptionChart } from '../../../components/chart';

// ----------------------------------------------------------------------

AppConversionRates.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
};

export default function AppConversionRates({ title, subheader, chartData, ...other }) {
  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = merge(BaseOptionChart(), {
    chart: {
      stacked: true,
    },
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => '',
        },
      },
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 },
    },
    xaxis: {
      categories: chartLabels,
    },
  });

  console.log('admin', chartOptions);

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart
          type="bar"
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
          options={chartOptions}
          height={364}
        />
        {/* <ReactApexChart type="bar" series={[{ data: chartSeries }]} options={chartOptions} height={364} /> */}
      </Box>
    </Card>
  );
}
