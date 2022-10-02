import { Button, Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Page from '../components/Page';
import Breadcrumbs from '../components/Breadcrumbs';
import Media from '../components/Media';
import useDataManage from '../hooks/useDataManage';
import StepperManage from '../components/StepperManage';
import Iconify from '../components/Iconify';
import { createFromWorkspace } from '../services/firebaseFunctions';

const steps = [
  {
    label: 'Maquina',
    type: 'workspace',
  },
  {
    label: 'Sistema',
    type: 'system',
  },
];

const Area = () => {
  const params = useParams();
  const [open, setOpen] = useState(false);

  const { data, loading } = useDataManage('area', params);

  const handleCreateWorkspace = async (values) => {
    try {
      const elem = await createFromWorkspace({ ...values, locationId: params.location, areaId: params.area });
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
    <Page name="Modificar">
      <StepperManage
        title="Añadir Area"
        open={open}
        onClose={handleClose}
        onAdd={handleCreateWorkspace}
        steps={steps}
      />
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3">Lugar de Trabajo</Typography>
          <Button onClick={handleOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Añadir Area
          </Button>
        </Stack>
        <Breadcrumbs
          link={[
            { name: 'Gestionar', href: '/dashboard/manage/locations' },
            { name: params.location, href: `/dashboard/manage/${params.location}` },
            { name: params.area, href: `/dashboard/manage/${params.location}/${params.area}` },
            {},
          ]}
        />
        <Media data={data} loading={loading} step="area" hrefs={params} />
      </Container>
    </Page>
  );
};

export default Area;
