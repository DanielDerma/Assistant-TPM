import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

const initialItems = [
  {
    id: 'company',
    label: 'Compañia',
  },
];
const steps2 = [
  {
    label: 'Subnivel',
    id: 'subnivel0',
  },
];

export default function StepperAddCompany({ onFinish }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [steps, setSteps] = React.useState(steps2);
  const [items, setItems] = React.useState(initialItems);
  const [value, setValue] = React.useState('');

  const handleNext = () => {
    setSteps([
      ...steps,
      {
        id: `subnivel${steps.length + 1} `,
        label: 'Subnivel',
      },
    ]);
    setItems([
      ...items,
      {
        id: `subnivel${items.length}`,
        label: value,
      },
    ]);

    setValue('');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleFinish = () => {
    onFinish([...items, { id: `subnivel${items.length}`, label: value }]);
    setActiveStep(-1);
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.id}>
            <StepLabel>{`${step.label} ${index + 1}`}</StepLabel>
            <StepContent>
              <TextField
                id="standard-basic"
                label="Nombre"
                variant="standard"
                value={value}
                fullWidth
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
