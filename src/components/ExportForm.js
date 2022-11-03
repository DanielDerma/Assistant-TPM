import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PropTypes from 'prop-types';
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import Stepper from './StepperForm';
import Excel from '../utils/icons/Excel';
import { getSubCollectionErrorsWithParams } from '../services/firebaseFunctions';
import Alert from './Alert';

const ExportForm = ({ structureHeaders }) => {
  const today = dayjs().startOf('day');
  const yesterday = today.subtract(1, 'day');

  const [openAlert, setOpenAlert] = useState(false);
  const [idPreview, setIdPreview] = useState(false);

  const formik = useFormik({
    initialValues: {
      dateI: yesterday,
      dateF: today,
      risk: 0,
      structure: [],
    },
    validationSchema: Yup.object().shape({
      dateI: Yup.date().required('La fecha inicial es requerida'),
      dateF: Yup.date().required('La fecha final es requerida'),
      risk: Yup.string().required('Requerido'),
      structure: Yup.array().test('structure', 'Requerido', (value) => value.length > 0),
    }),
    onSubmit: (values) => {
      const dateI = values.dateI.format('YYYY-MM-DD');
      const dateF = values.dateF.format('YYYY-MM-DD');

      getSubCollectionErrorsWithParams(values).then((arr) => {
        const orderArrWithStructureHeaders = arr.map(
          ({ id, structure, date, time, risk, description, image, type }) => ({
            id,
            ...structureHeaders.reduce((prev, elem, i) => ({ ...prev, [elem]: structure[i] }), {}),
            date,
            time,
            risk,
            description,
            image,
            type,
          })
        );

        const nameRisk = (risk) => {
          if (risk === 0) return 'TODOS_LOS_RIESGOS';
          if (risk === 10) return 'RIESGO_BAJO';
          if (risk === 20) return 'RIESGO_MEDIO';
          if (risk === 30) return 'RIESGO_ALTO';
          if (risk === 40) return 'RIESGO_MUY_ALTO';
          if (risk === 40) return 'RIESGO_EXTREMO';
          return 'NO_DEFINIDO';
        };

        const titleStructure = values.structure.reduce((prev, { title }) => {
          if (prev === '') return title;
          return `${prev}-${title}`;
        }, '');

        const path = `Errores_${titleStructure}_entre_${dateI}_y_${dateF}_riesgo_${nameRisk()}`;

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(orderArrWithStructureHeaders);
        XLSX.utils.book_append_sheet(wb, ws, 'Errores');
        XLSX.writeFile(wb, `${path}.xlsx`);
      });
    },
  });

  const handleDateI = (value) => {
    formik.setFieldValue('dateI', value);
  };
  const handleDateF = (value) => {
    formik.setFieldValue('dateF', value);
  };
  const handleDateStructure = (value) => {
    formik.setFieldValue('structure', value);
  };

  const handleCloseAlert = () => setOpenAlert(false);
  const handleOpenAlert = (id) => {
    setIdPreview(id);
    setOpenAlert(true);
  };

  const difference = formik.values.dateF.diff(formik.values.dateI, 'day');

  return (
    <Box>
      <Alert
        open={openAlert}
        onClose={handleCloseAlert}
        severity="success"
      >{`Creado con éxito, Folio: ${idPreview}`}</Alert>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack
          spacing={{ xs: 1, sm: 3 }}
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-around"
          sx={{ width: '100%' }}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <DesktopDatePicker
            label="Inicio"
            inputFormat="MM/DD/YYYY"
            value={formik.values.dateI}
            onChange={handleDateI}
            renderInput={(params) => <TextField {...params} />}
          />
          <DesktopDatePicker
            label="Final"
            inputFormat="MM/DD/YYYY"
            value={formik.values.dateF}
            onChange={handleDateF}
            minDate={formik.values.dateI.add(1, 'day')}
            renderInput={(params) => <TextField {...params} />}
          />
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel id="demo-simple-select-label">Estatus</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Estatus"
              value={formik.values.risk}
              onChange={(event) => {
                formik.setFieldValue('risk', event.target.value);
              }}
              error={formik.touched.risk && Boolean(formik.errors.risk)}
            >
              <MenuItem value={0}>Todos los Riesgos</MenuItem>
              <MenuItem value={10}>Poco Riego</MenuItem>
              <MenuItem value={20}>Riesgo Medio</MenuItem>
              <MenuItem value={30}>Riesgo Alto</MenuItem>
              <MenuItem value={40}>Riesgo Muy Alto</MenuItem>
              <MenuItem value={50}>Riesgo Extremo</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        {difference > 0 && (
          <Typography variant="subtitle1" sx={{ ml: { xs: 2, sm: 4 }, mt: 1 }}>
            Dias a Calcular: {difference}
          </Typography>
        )}
      </LocalizationProvider>
      <Box sx={{ mt: 5 }}>
        <Stepper
          onFinish={handleDateStructure}
          fullWidth
          errorSubmit={Boolean(formik.errors.structure && formik.touched.structure)}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button variant="contained" onClick={formik.handleSubmit} endIcon={<Excel />} sx={{ mx: 'auto' }}>
          Exportar
        </Button>
      </Box>
    </Box>
  );
};

ExportForm.propTypes = {
  structureHeaders: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ExportForm;
