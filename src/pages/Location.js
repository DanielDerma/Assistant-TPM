import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Page from '../components/Page';
import Breadcrumbs from '../components/Breadcrumbs';
import Media from '../components/Media';

const Modify = () => {
  const { location } = useParams();
  useEffect(() => {}, []);
  return (
    <Page name="Modificar">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 4 }}>
          Area
        </Typography>
        <Breadcrumbs
          link={[
            { name: 'Gestionar', href: '/dashboard/manage/locations' },
            { name: location, href: `/dashboard/manage/${location}` },
            {},
          ]}
        />
        <Media />
      </Container>
    </Page>
  );
};

export default Modify;
