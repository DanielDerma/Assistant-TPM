import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Stack,
  Box,
  Slider,
} from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import AvatarEditor from 'react-avatar-editor';

import { createUser, getCompanies, getLocation } from '../../../services/firebaseFunctions';
import useAuth from '../../../hooks/useAuth';
import Dropzone from '../../Dropzone';

TableAdd.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onFinish: PropTypes.func,
};

export default function TableAdd({ open, onClose, onFinish }) {
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [scale, setScale] = useState(1);
  const { currentUser } = useAuth();

  const editor = useRef(null);

  useEffect(() => {
    setLoading(true);
    getCompanies().then((data) => {
      setMenuItems(data);
      setLoading(false);
    });
  }, [open]);

  const handleCloseWithReset = () => {
    onClose();
    formik.resetForm();
  };

  const handleImg = (img) => {
    formik.setFieldValue('profileImg', img);
  };

  const formik = useFormik({
    initialValues: {
      fname: '',
      lname: '',
      age: '',
      contactAdd: '',
      email: '',
      company: '',
      profileImg: '/static/mock-images/avatars/avatar-placeholder.png',
    },
    validationSchema: Yup.object({
      fname: Yup.string().max(20, 'Máximo 20 letras').required('Requerido'),
      lname: Yup.string().max(20, 'Máximo 20 letras').required('Requerido'),
      age: Yup.number().min(18, 'Debe de ser mayor de edad').max(100, 'Edad muy alta').required('Requerido'),
      contactAdd: Yup.number()
        .typeError('Debe de ser un numero')
        .required('Requerido')
        .test('len', 'Los números son 10 dígitos exactos', (val) => (val ? val.toString().length === 10 : true)),
      email: Yup.string().email('Email invalido').required('Requerido'),
      company: Yup.string().required(),
      profileImg: Yup.string().required('Requerido'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const password = Math.random().toString(36).slice(-8);
        const companyItem = menuItems.find((item) => item.title === values.company);
        const structure = await getLocation(companyItem.id);

        const company = {
          id: companyItem.id,
          title: companyItem.title,
          structure,
        };

        const canvas = editor.current.getImageScaledToCanvas();

        const img = await new Promise((resolve) =>
          canvas.toBlob((elem) => {
            resolve(elem);
          }, 'image/jpeg')
        );

        await createUser({ ...values, password, company, profileImg: img }, currentUser);

        setLoading(false);
        onFinish();
        handleCloseWithReset();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div>
      <Dialog open={open} onClose={handleCloseWithReset} maxWidth="md" fullWidth>
        <DialogTitle>Agregar Usuario</DialogTitle>
        <DialogContent>
          <Stack direction="row">
            <Box sx={{ maxWidth: '50%' }}>
              <TextField
                margin="dense"
                id="nombre"
                label="Nombres"
                type="text"
                fullWidth
                variant="standard"
                error={formik.touched.fname && Boolean(formik.errors.fname)}
                helperText={formik.touched.fname && formik.errors.fname}
                {...formik.getFieldProps('fname')}
              />
              <TextField
                margin="dense"
                id="lname"
                label="Apellidos"
                type="text"
                fullWidth
                variant="standard"
                error={formik.touched.lname && Boolean(formik.errors.lname)}
                helperText={formik.touched.lname && formik.errors.lname}
                {...formik.getFieldProps('lname')}
              />
              <TextField
                margin="dense"
                id="age"
                label="Edad"
                type="number"
                fullWidth
                variant="standard"
                error={formik.touched.age && Boolean(formik.errors.age)}
                helperText={formik.touched.age && formik.errors.age}
                {...formik.getFieldProps('age')}
              />
              <TextField
                margin="dense"
                id="contact"
                label="Contacto"
                type="number"
                fullWidth
                variant="standard"
                error={formik.touched.contactAdd && Boolean(formik.errors.contactAdd)}
                helperText={formik.touched.contactAdd && formik.errors.contactAdd}
                {...formik.getFieldProps('contactAdd')}
              />
              <TextField
                margin="dense"
                id="email"
                label="Correo"
                type="email"
                fullWidth
                variant="standard"
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                {...formik.getFieldProps('email')}
              />
              <FormControl fullWidth variant="standard">
                <InputLabel id="company">Compañia</InputLabel>
                <Select
                  labelId="company"
                  id="company"
                  value={formik.values.company}
                  onChange={(event) => {
                    formik.setFieldValue('company', event.target.value);
                  }}
                  error={formik.touched.company && Boolean(formik.errors.company)}
                  label="Compañia"
                  fullWidth
                >
                  {[
                    <MenuItem value="" key="null">
                      <em>None</em>
                    </MenuItem>,
                    !loading &&
                      menuItems.map((item) => (
                        <MenuItem key={item.id} value={item.title}>
                          {item.title}
                        </MenuItem>
                      )),
                  ]}
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                width: '50%',
                marginLeft: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Dropzone onFinish={(image) => handleImg(image)} styleContainer={{ width: '100%' }} />
              <AvatarEditor
                image={formik.values.profileImg}
                ref={editor}
                width={250}
                height={250}
                border={50}
                borderRadius={2000}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={scale}
                rotate={0}
              />
              <Slider
                onChange={(event, newValue) => setScale(newValue / 100)}
                size="small"
                min={100}
                max={300}
                aria-label="Small"
                valueLabelDisplay="auto"
                sx={{ width: '90%' }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWithReset}>Cancel</Button>
          <LoadingButton onClick={formik.handleSubmit} loading={loading}>
            Añadir
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
