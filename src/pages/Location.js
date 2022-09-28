import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';
import { useParams } from 'react-router-dom';
import Page from '../components/Page';
import { Breadcrumbs, Media } from '../sections/@dashboard/modify';

const Modify = () => {
  const { name } = useParams();
  return (
    <Page name="Modificar">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          {name}
        </Typography>
        <Breadcrumbs link={[{ name: 'Gestionar' }, { name: 'Lugar', href: '/dashboard/manage' }, { name }]} />
        <Media />
      </Container>
    </Page>
  );
};

export default Modify;
