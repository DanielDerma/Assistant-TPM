import { useEffect, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useParams } from 'react-router-dom';
import Page from '../components/Page';
import Breadcrumbs from '../components/Breadcrumbs';
import Media from '../components/Media';
import Iconify from '../components/Iconify';
import { getFeed2 } from '../services/firebaseFunctions';

const Area = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([]);

  useEffect(() => {
    const paramsArray = params['*'].split('/');
    getFeed2(paramsArray)
      .then((elem) => {
        setData(elem);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
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
        <Media data={data} loading={loading} step="area" />
      </Container>
    </Page>
  );
};

export default Area;
