import { useEffect, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useParams, useLocation } from 'react-router-dom';
import Page from '../components/Page';
import Breadcrumbs from '../components/Breadcrumbs';
import AddSubItem from '../components/ModalForm/AddSubItem';
import Media from '../components/Media';
import Iconify from '../components/Iconify';
import { getFeed2 } from '../services/firebaseFunctions';

const Area = () => {
  const params = useParams();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [utils, setUtils] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paramsArray = params['*'].split('/');
    setLoading(true);
    getFeed2(paramsArray)
      .then(({ data, utils }) => {
        setData(data);
        setUtils(utils);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log({ data, utils, loading });

  return (
    <Page title="Trabajo">
      {/* <AddSubItem title="Añadir ...." open={open} onClose={handleClose} /> */}
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3">Sub</Typography>
          <Button onClick={handleOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Añadir
          </Button>
        </Stack>
        <Breadcrumbs utils={utils} loading={loading} />
        <Media data={data} loading={loading} pathname={pathname} />
      </Container>
    </Page>
  );
};

export default Area;
