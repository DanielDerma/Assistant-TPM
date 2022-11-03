import { useEffect, useState } from 'react';
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
} from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import { createUser, getCompanies } from '../../../services/firebaseFunctions';
import useAuth from '../../../hooks/useAuth';

TableAdd.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

export default function TableAdd({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const { currentUser } = useAuth();

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

  const formik = useFormik({
    initialValues: {
      fname: '',
      lname: '',
      age: '',
      contactAdd: '',
      email: '',
      company: '',
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
    }),
    onSubmit: (values) => {
      setLoading(true);
      const password = Math.random().toString(36).slice(-8);
      const company = menuItems.find((item) => item.title === values.company);

      createUser({ ...values, password, company }, currentUser)
        .then(() => {
          handleCloseWithReset();
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <div>
      <Dialog open={open} onClose={handleCloseWithReset} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Usuario</DialogTitle>
        <DialogContent>
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
