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
import Dropzone from '../Dropzone';
import StepperForm from '../StepperForm';
import { createError } from '../../services/firebaseFunctions';

const FormAdd = ({ onClose, open, title }) => {
  const [imgPreview, setImgPreview] = useState('');
  const today = dayjs(new Date());
  const tomorrow = dayjs().endOf('day');

  useEffect(() => {
    if (open) {
      formik.setFieldValue('type', title.type);
    }
  }, [open, title]); // eslint-disable-line

  const formik = useFormik({
    initialValues: {
      dateAndTime: today,
      anomaly: '',
      description: '',
      image: '',
      type: title.type,
      stepper: {
        location: {
          id: '',
          title: '',
        },
        area: {
          id: '',
          title: '',
        },
        workspace: {
          id: '',
          title: '',
        },
        system: {
          id: '',
          title: '',
        },
      },
    },
    validationSchema: Yup.object({
      dateAndTime: Yup.string().required('Requerido'),
      anomaly: Yup.string().required('Requerido'),
      description: Yup.string().required('Requerido').max(50, 'Máximo 50 caracteres'),
      image: Yup.string().required('Requerido'),
      stepper: Yup.object().shape({
        location: Yup.object().shape({
          id: Yup.string().required(),
          title: Yup.string().required(),
        }),
        area: Yup.object().shape({
          id: Yup.string().required(),
          title: Yup.string().required(),
        }),
        workspace: Yup.object().shape({
          id: Yup.string().required(),
          title: Yup.string().required(),
        }),
        system: Yup.object().shape({
          id: Yup.string().required(),
          title: Yup.string().required(),
        }),
      }),
    }),
    onSubmit: (values) => {
      createError(values)
        .then((elem) => {
          console.log(elem, 'elemrefid');
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
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
    formik.setFieldValue('image', image);
  };
  const handleImagePreview = (image) => {
    setImgPreview(URL.createObjectURL(image));
  };

  const handleFinish = (value) => {
    formik.setFieldValue('stepper', value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth sx={{ minHeight: 700 }}>
      <DialogTitle>{title.title}</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={12} md={4}>
            <StepperForm onFinish={handleFinish} errorSubmit={formik.errors.stepper && formik.touched.stepper} />
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
                        value={formik.values.anomaly}
                        onChange={(event) => {
                          formik.setFieldValue('anomaly', event.target.value);
                        }}
                        error={formik.touched.anomaly && Boolean(formik.errors.anomaly)}
                      >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value={20}>Estatus 1</MenuItem>
                        <MenuItem value={30}>Estatus 2</MenuItem>
                        <MenuItem value={40}>Estatus 3</MenuItem>
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
              <Dropzone onFinish={handleImage} onPreview={handleImagePreview} />
              <Image src={imgPreview} shift="top" distance="2rem" shiftDuration={320} sx={{ height: 250 }} />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseWithReset}>Cancelar</Button>
        <Button onClick={formik.handleSubmit}>Añadir</Button>
      </DialogActions>
    </Dialog>
  );
};

FormAdd.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.object.isRequired,
};

export default FormAdd;
