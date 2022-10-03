import { Button, Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Page from '../components/Page';
import Breadcrumbs from '../components/Breadcrumbs';
import Media from '../components/Media';
import useDataManage from '../hooks/useDataManage';
import StepperManage from '../components/StepperManage';
import Iconify from '../components/Iconify';
import { createFromSystem } from '../services/firebaseFunctions';

const steps = [
  {
    label: 'Sistema',
    type: 'system',
  },
];

const Modify = () => {
  const { location, area, workspace } = useParams();
  const [open, setOpen] = useState(false);

  const values = {
    location: { id: location },
    area: { id: area },
    workspace: { id: workspace },
  };

  const { data, loading } = useDataManage('workspace', values);

  const handleCreateSystem = async (values) => {
    try {
      const elem = await createFromSystem({
        ...values,
        locationId: location,
        areaId: area,
        workspaceId: workspace,
      });
      console.log(elem);
      return elem;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Page title="Sistemas">
      <StepperManage
        open={open}
        onClose={handleClose}
        onAdd={handleCreateSystem}
        steps={steps}
        title="Añadir Sistema"
      />
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3">Sistema</Typography>
          <Button onClick={handleOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Añadir Sistema
          </Button>
        </Stack>
        <Breadcrumbs
          link={[
            { name: 'Gestionar', href: '/dashboard/manage/locations' },
            { name: location, href: `/dashboard/manage/${location}` },
            { name: area, href: `/dashboard/manage/${location}/${area}` },
            { name: workspace, href: `/dashboard/manage/${location}/${area}/${workspace}` },
            {},
          ]}
        />
        <Media data={data} loading={loading} step="workspace" hrefs={false} />
      </Container>
    </Page>
  );
};

export default Modify;
