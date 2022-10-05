import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { createLocationRefs } from '../services/firebaseFunctions';

const steps2 = [
  {
    label: 'Nombre Compañia',
    id: 'subnivel0',
  },
];

export default function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [steps, setSteps] = React.useState(steps2);
  const [items, setItems] = React.useState([]);
  const [value, setValue] = React.useState('');

  const randomId = () => Math.random().toString(36).slice(-8);

  const handleNext = () => {
    const newItem = {
      id: randomId(),
      label: 'Subnivel',
    };
    setSteps((prev) => [...prev, newItem]);
    setItems((prev) => [...prev, value]);
    setValue('');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleFinish = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    createLocationRefs([...items, value]).then((elem) => console.log(elem));
  };

  console.log(items);

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.id}>
            <StepLabel>{`${step.label} ${index !== 0 ? index : ''}`}</StepLabel>
            <StepContent>
              <TextField
                id="standard-basic"
                label="Nombre"
                variant="standard"
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />

              <Box sx={{ mb: 2 }}>
                <div>
                  <Button variant="contained" onClick={handleNext} disabled={value.length === 0} sx={{ mt: 1, mr: 1 }}>
                    Continuar
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    disabled={activeStep < 1 || value.length === 0}
                    onClick={handleFinish}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Terminar
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
