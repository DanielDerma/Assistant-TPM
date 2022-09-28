import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LoadingButton } from '@mui/lab';
import { getLocations } from '../../../services/firebaseFunctions';
import { DataPicker } from '.';
import { useAdd } from '../../../hooks/useAddPage';

export default function FormDialog() {
  const { open, handleClose } = useAdd();
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [age, setAge] = React.useState('');
  const [steps, setSteps] = React.useState({});

  React.useEffect(() => {
    if (open) {
      setLoading(true);
      getLocations().then((data) => {
        setSteps(data);
        setLoading(false);
      });
    }
  }, [open]);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleNext = () => {
    // setLoading(true);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    // getLocations().then((data) => {

    // }).catch((error) => {

    // }).finally(() => {
    //   setLoading(false);

    // })
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isFinish = activeStep === steps.length;

  return (
    <Dialog open={open} onClose={handleClose} disableEscapeKeyDown maxWidth="sm" fullWidth>
      <DialogTitle>Mantenimiento</DialogTitle>
      <DialogContent>
        {loading && <Typography sx={{ textAlign: 'center' }}>Cargando...</Typography>}
        {!loading && (
          <Stepper activeStep={activeStep} orientation="vertical">
            {[...steps, { label: '....' }].map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <Box>
                    <Typography>{step.description}</Typography>
                    <FormControl variant="standard" sx={{ m: 1 }} fullWidth>
                      <InputLabel id="demo-simple-select-standard-label">
                        Mantenimiento del computo de la empresa
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={age}
                        onChange={handleChange}
                        label="Mantenimiento del computo de la empresa"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>computo de la empresa</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <div>
                      <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                        Atras
                      </Button>
                      <LoadingButton loading={loading} variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                        {index === steps.length - 1 ? 'Terminar' : 'Continuar'}
                      </LoadingButton>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        )}

        {isFinish && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <DataPicker />
            <FormControl variant="standard" sx={{ m: 1 }} fullWidth>
              <InputLabel id="demo-simple-select-standard-label">Mantenimiento del computo de la empresa</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={age}
                onChange={handleChange}
                label="Mantenimiento del computo de la empresa"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>computo de la empresa</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleClose} disabled={!isFinish}>
          Añadir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
