import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { getLocations } from '../services/firebaseFunctions';
import Page from '../components/Page';
import Breadcrumbs from '../components/Breadcrumbs';
import Media from '../components/Media';

const Modify = () => {
  const [data, setData] = useState([]);
  console.log();

  useEffect(() => {
    getLocations().then((data) => {
      setData(data);
    });
  }, []);

  return (
    <Page title="Modificar">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 4 }}>
          Compañías
        </Typography>
        <Breadcrumbs link={[{ name: 'Gestionar', href: '/dashboard/manage/locations' }, {}]} />
        <Media data={data} />
      </Container>
    </Page>
  );
};

export default Modify;
