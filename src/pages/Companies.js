import { Button, Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { getLocations } from '../services/firebaseFunctions';
import Page from '../components/Page';
import Breadcrumbs from '../components/Breadcrumbs';
import Media from '../components/Media';
import Iconify from '../components/Iconify';
import AddCompany from '../components/ModalForm/AddCompany';

const steps = [
  {
    label: 'Compañía',
    type: 'location',
  },
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
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLocations()
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCreateCompany = async (values) => {
    // try {
    //   const elem = createFromLocation(values);
    //   console.log(elem);
    //   return elem;
    // } catch (error) {
    //   console.log(error);
    //   return error;
    // }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Page title="Modificar">
      <AddCompany title="Añadir Compañía" open={open} onClose={handleClose} steps={steps} onAdd={handleCreateCompany} />
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Compañía</Typography>
          <Button onClick={handleOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Añadir Compañía
          </Button>
        </Stack>
        <Breadcrumbs link={[{ name: 'Gestionar', href: '/dashboard/manage/locations' }, {}]} />
        <Media data={data} loading={loading} step={null} hrefs={{}} />
      </Container>
    </Page>
  );
};

export default Modify;