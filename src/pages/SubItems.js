import { useEffect, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Page from '../components/Page';
import Breadcrumbs from '../components/Breadcrumbs';
import AddSubItem from '../components/ModalForm/AddSubItem';
import Media from '../components/Media';
import Iconify from '../components/Iconify';
import { getFeed2 } from '../services/firebaseFunctions';

const SubItems = () => {
  const params = useParams();
  const { pathname } = useLocation();
  const router = useNavigate();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [utils, setUtils] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // take the string path
    const path = params['*'];
    // check if params was a final / and remove it
    const pathname = path.slice(-1) === '/' ? path.slice(0, -1) : path;
    if (path.slice(-1) === '/') {
      router(path.slice(0, -1));
    }

    const paramsArray = pathname.split('/');
    setLoading(true);
    getFeed2(paramsArray)
      .then(({ data, utils }) => {
        setData(data);
        setUtils(utils);
        setError(false);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setData([]);
        setError(true);
        setLoading(false);
      });
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const paths = params['*'].split('/');

  const isAboveLimit = Object.keys(utils).length > 0 ? utils.structure.length >= paths.length : undefined;

  return (
    <Page title="Trabajo">
      {/* <AddSubItem title="Añadir ...." open={open} onClose={handleClose} /> */}
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3">{data?.[0]?.label}</Typography>
          <Button onClick={handleOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Añadir
          </Button>
        </Stack>
        <Breadcrumbs utils={utils} loading={loading} error={error} paths={paths} />
        <Media data={data} loading={loading} pathname={pathname} error={error} limit={isAboveLimit} />
      </Container>
    </Page>
  );
};

export default SubItems;
