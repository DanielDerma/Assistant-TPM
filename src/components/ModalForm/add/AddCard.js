// mui
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, InputLabel, MenuItem, Select, Stack, TextField, Grid, Box } from '@mui/material';

// validation
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

// components
import Image from 'mui-image';
import { LoadingButton } from '@mui/lab';
import Dropzone from '../../Dropzone';
import StepperForm from '../../StepperForm';
import { createError } from '../../../services/firebaseFunctions';

const FormAdd = ({ onClose, open, title, onConfirm }) => {
  const [imgPreview, setImgPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const today = dayjs(new Date());
  const tomorrow = dayjs().endOf('day');

  useEffect(() => {
    if (open) {
      formik.setFieldValue('type', title.type);
    }
  }, [open, title]); // eslint-disable-line react-hooks/exhaustive-deps

  const formik = useFormik({
    initialValues: {
      dateAndTime: today,
      risk: '',
      description: '',
      image: '',
      type: title.type,
      structure: [],
    },
    validationSchema: Yup.object({
      dateAndTime: Yup.date().required('Requerido'),
      risk: Yup.string().required('Requerido'),
      description: Yup.string().required('Requerido').max(50, 'Máximo 50 caracteres'),
      image: Yup.string().required('Requerido'),
      structure: Yup.array().test('structure', 'Requerido', (value) => value.length > 0),
    }),
    onSubmit: (values) => {
      setLoading(true);
      createError(values)
        .then((elem) => {
          onConfirm(elem);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
          onClose();
          setImgPreview('');
          formik.resetForm();
        });
    },
  });

  const handleCloseWithReset = () => {
    onClose();
    formik.resetForm();
    setImgPreview('');
  };

  const handleDateAndTime = (value) => {
    formik.setFieldValue('dateAndTime', value);
  };
  const handleImage = (image) => {
    setImgPreview(URL.createObjectURL(image));
    formik.setFieldValue('image', image);
  };

  const handleStructure = (value) => {
    formik.setFieldValue('structure', value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth sx={{ minHeight: 700 }}>
      <DialogTitle>{title.title}</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={12} md={4}>
            <StepperForm
              onFinish={handleStructure}
              errorSubmit={Boolean(formik.errors.structure && formik.touched.structure)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ width: '100%' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormControl variant="standard" sx={{ m: 1 }} component="form" onSubmit={formik.handleSubmit}>
                  <Stack spacing={3} direction="column">
                    <DateTimePicker
                      label="Date&Time picker"
                      value={formik.values.dateAndTime}
                      onChange={handleDateAndTime}
                      maxDate={tomorrow}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <FormControl sx={{ minWidth: 250 }}>
                      <InputLabel id="demo-simple-select-label">Estatus de Anomalía</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Estatus de Anomalía"
                        value={formik.values.risk}
                        onChange={(event) => {
                          formik.setFieldValue('risk', event.target.value);
                        }}
                        error={formik.touched.risk && Boolean(formik.errors.risk)}
                      >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value={10}>Poco Riego</MenuItem>
                        <MenuItem value={20}>Riesgo Medio</MenuItem>
                        <MenuItem value={30}>Riesgo Alto</MenuItem>
                        <MenuItem value={40}>Riesgo Muy Alto</MenuItem>
                        <MenuItem value={50}>Riesgo Extremo</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      id="standard-basic"
                      label="Descripcion"
                      value={formik.values.description}
                      onChange={(event) => {
                        formik.setFieldValue('description', event.target.value);
                      }}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                    />
                  </Stack>
                </FormControl>
              </LocalizationProvider>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ width: '100%' }}>
              <Dropzone onFinish={handleImage} />
              <Image src={imgPreview} shift="top" distance="2rem" shiftDuration={320} sx={{ height: 250 }} />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseWithReset}>Cancelar</Button>
        <LoadingButton loading={loading} onClick={formik.handleSubmit}>
          Añadir
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

FormAdd.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default FormAdd;
