import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { Box, Grid, TextField } from '@mui/material';
import * as Yup from 'yup';

import Image from 'mui-image';
import { useFormik } from 'formik';
import StepperAddCompany from '../StepperAddCompany';
import Dropzone from '../Dropzone';
import { createLocation } from '../../services/firebaseFunctions';

FormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default function FormDialog({ open, onClose, title }) {
  const [imgPreview, setImgPreview] = React.useState('');

  const handleImgPreview = (file) => setImgPreview(URL.createObjectURL(file));

  const formik = useFormik({
    initialValues: {
      company: '',
      description: '',
      image: '',
      stepper: [],
    },
    validationSchema: Yup.object({
      company: Yup.string().required('Requerido'),
      description: Yup.string().required('Requerido'),
      image: Yup.string().required('Requerido'),
      stepper: Yup.array().required('Requerido'),
    }),
    onSubmit: (values) => {
      createLocation(values).then((elem) => {
        console.log(elem);
      });
    },
  });

  const handleStepper = (data) => {
    formik.setFieldValue('stepper', data);
  };

  const handleImage = (data) => {
    formik.setFieldValue('image', data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ minHeight: 700 }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ height: '90vh' }}>
        <Grid container spacing={4}>
          <Grid item md={6}>
            <TextField
              variant="standard"
              id="standard-basic"
              label="Nombre"
              sx={{ width: '100%' }}
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
              {...formik.getFieldProps('company')}
            />
            <TextField
              variant="standard"
              id="standard-basic2"
              label="Descripción"
              sx={{ width: '100%' }}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              {...formik.getFieldProps('description')}
            />
            <Box sx={{ width: '100%', mt: 4 }}>
              <Dropzone onFinish={handleImage} onPreview={handleImgPreview} />
              <Image src={imgPreview} shift="top" distance="2rem" shiftDuration={320} height={300} fit="contain" />
            </Box>
          </Grid>
          <Grid item md={6}>
            <StepperAddCompany onFinish={handleStepper} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={formik.handleSubmit}>Añadir</Button>
      </DialogActions>
    </Dialog>
  );
}
