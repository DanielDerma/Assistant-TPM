import { Container, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import ExportForm from '../components/ExportForm';
import Page from '../components/Page';

const Export = ({ isAdmin }) => (
  <Page title="Exportar">
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Selecciona las características que desea ver en el documento.
      </Typography>
      <ExportForm isAdmin={isAdmin} />
    </Container>
  </Page>
);

Export.propTypes = {
  isAdmin: PropTypes.bool,
};

export default Export;
