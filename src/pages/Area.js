import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';
import { useParams } from 'react-router-dom';
import Page from '../components/Page';
import Breadcrumbs from '../components/Breadcrumbs';
import Media from '../components/Media';

const Area = () => {
  const { location, area } = useParams();
  return (
    <Page name="Modificar">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 4 }}>
          Lugar de Trabajo
        </Typography>
        <Breadcrumbs
          link={[
            { name: 'Gestionar', href: '/dashboard/manage/locations' },
            { name: location, href: `/dashboard/manage/${location}` },
            { name: area, href: `/dashboard/manage/${location}/${area}` },
          ]}
        />
        <Media />
      </Container>
    </Page>
  );
};

export default Area;
