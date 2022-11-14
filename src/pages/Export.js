import { Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { getLocation } from '../services/firebaseFunctions';
import ExportForm from '../components/ExportForm';
import Page from '../components/Page';
import useAuth from '../hooks/useAuth';

const Export = () => {
  const [headers, setHeaders] = useState([]);
  const { company } = useAuth();

  useEffect(() => {
    getLocation(company.id)
      .then((steps) => {
        setHeaders(steps);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Page title="Exportar">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Selecciona las características que desea ver en el documento.
        </Typography>
        <ExportForm structureHeaders={headers} />
      </Container>
    </Page>
  );
};

export default Export;
