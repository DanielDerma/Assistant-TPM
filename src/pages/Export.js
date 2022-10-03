import { Box, Button, Container, Typography } from '@mui/material';
import React from 'react';
import DataPickerRange from '../components/DataPickerRange';
import Excel from '../utils/icons/Excel';
import Page from '../components/Page';
import Stepper from '../components/StepperForm';

const Export = () => {
  console.log();
  return (
    <Page title="Exportar">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Selecciona las características que desea ver en el documento.
        </Typography>
        <DataPickerRange />
        <Box sx={{ mt: 5 }}>
          <Stepper onFinish={(data) => console.log(data)} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="contained" endIcon={<Excel />} sx={{ mx: 'auto' }}>
            Exportar
          </Button>
        </Box>
      </Container>
    </Page>
  );
};

export default Export;
