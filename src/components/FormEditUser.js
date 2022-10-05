import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import { getLocations, updateUser } from '../services/firebaseFunctions';

TableAdd.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  preview: PropTypes.object
};

export default function TableAdd({ open, onClose, preview }) {
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    setLoading(true);
    getLocations().then((data) => {
      setMenuItems(data);
      setLoading(false);
    });

  },[])

  const formik = useFormik({
    initialValues: {
      fname: '',
      lname: '',
      age: '',
      contactAdd: '',
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
      company: Yup.string().max(20, 'Máximo 20 letras').required('Requerido'),
    }),
    onSubmit: (values) => {
      setLoading(true);
      updateUser(preview.email, values).then(() => {
        handleCloseWithReset();
        setLoading(false);
      });
    },
  });

  const handleCloseWithReset = () => {
    onClose();
    formik.resetForm();
  };

  useEffect(() => {
    if (preview) {
      const {email, password, ...rest} = preview; //eslint-disable-line
      formik.setValues(rest, false);
    }
  }, [preview]); //eslint-disable-line

  return (
    <div>
      <Dialog open={open} onClose={handleCloseWithReset}>
          <DialogTitle>Editar Usuario</DialogTitle>
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
