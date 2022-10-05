import { useEffect } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useParams } from 'react-router-dom';
import Page from '../components/Page';
import Breadcrumbs from '../components/Breadcrumbs';
import Media from '../components/Media';
import Iconify from '../components/Iconify';
import { getFeed } from '../services/firebaseFunctions';

const Area = () => {
  const params = useParams();

  useEffect(() => {
    const paramsArray = params['*'].split('/');
    getFeed(paramsArray);
  }, []);

  return (
    <Page title="Trabajo">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3">Sub</Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Añadir
          </Button>
        </Stack>
        <Breadcrumbs link={[{ name: 'Gestionar', href: '/dashboard/manage' }, {}]} />
        <Media data={[]} loading={false} step="area" />
      </Container>
    </Page>
  );
};

export default Area;
