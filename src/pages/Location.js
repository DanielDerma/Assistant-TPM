import { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useParams } from 'react-router-dom';
import Page from '../components/Page';
import Breadcrumbs from '../components/Breadcrumbs';
import Media from '../components/Media';
import useDataManage from '../hooks/useDataManage';
import StepperManage from '../components/StepperManage';
import Iconify from '../components/Iconify';
import { createFromArea } from '../services/firebaseFunctions';

const steps = [
  {
    label: 'Área',
    type: 'area',
  },
  {
    label: 'Maquina',
    type: 'workspace',
  },
  {
    label: 'Sistema',
    type: 'system',
  },
];

const Modify = () => {
  const params = useParams();
  const [open, setOpen] = useState(false);

  const { data, loading } = useDataManage('location', params); // object bc destructure

  const handleCreateArea = async (values) => {
    try {
      const elem = await createFromArea({ ...values, locationId: params.location });
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
      <StepperManage title="Añadir Area" open={open} onClose={handleClose} steps={steps} onAdd={handleCreateArea} />
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3">Area</Typography>
          <Button onClick={handleOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Añadir Área
          </Button>
        </Stack>
        <Breadcrumbs
          link={[
            { name: 'Gestionar', href: '/dashboard/manage/locations' },
            { name: params.location, href: `/dashboard/manage/${params.location}` },
            {},
          ]}
        />
        <Media data={data} loading={loading} step="location" hrefs={params} />
      </Container>
    </Page>
  );
};

export default Modify;
