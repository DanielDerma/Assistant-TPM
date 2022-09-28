import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';
import Page from '../components/Page';
import { Breadcrumbs, Media } from '../sections/@dashboard/modify';

const Modify = () => {
  console.log();
  return (
    <Page title="Modificar">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Lugar
        </Typography>
        <Breadcrumbs link={[{ name: 'Gestionar' }, { name: 'Lugar', href: '/dashboard/manage' }]} />
        <Media />
      </Container>
    </Page>
  );
};

export default Modify;
