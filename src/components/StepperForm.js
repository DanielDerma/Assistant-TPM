import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FormControl, MenuItem, Select } from '@mui/material';
import PropTypes from 'prop-types';
import { getFeed, getLocations } from '../services/firebaseFunctions';

const steps = [
  {
    label: 'Compañía',
    type: 'location',
  },
  {
    label: 'Area',
    type: 'area',
  },
  {
    label: 'Maquina',
    type: 'workspace',
  },
  {
    label: 'Sistema',
    type: 'system',
  },
];

export default function FormDialog({ onFinish, errorSubmit }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [menuItems, setMenuItems] = React.useState([]);

  React.useEffect(() => {
    setLoading(true);
    getLocations().then((data) => {
      setMenuItems(data);
      setLoading(false);
    });
  }, []);

  const handleNext = (step) => {
    getFeed(step, formik.values).then((data) => {
      setMenuItems(data);
      setLoading(false);
    });
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setLoading(true);
  };

  const handleBack = (step) => {
    getFeed(step, formik.values).then((data) => {
      setMenuItems(data);
      setLoading(false);
    });

    setLoading(true);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const formik = useFormik({
    initialValues: {
      location: '',
      area: '',
      workspace: '',
      system: '',
    },
    validationSchema: Yup.object({
      location: Yup.string().required('Campo requerido'),
      area: Yup.string().required('Campo requerido'),
      workspace: Yup.string().required('Campo requerido'),
      system: Yup.string().required('Campo requerido'),
    }),
    onSubmit: (values) => {
      onFinish(values);
    },
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 2 }}>
        {steps.map((step, index) => {
          const prevStep = steps[index - 2] ? steps[index - 2].type : null;
          return (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <FormControl variant="standard" sx={{ m: 1 }} component="form" onSubmit={formik.handleSubmit}>
                  <Select
                    labelId="campus"
                    id={step.type}
                    value={formik.values[step.type]}
                    onChange={(event) => {
                      formik.setFieldValue(step.type, event.target.value);
                    }}
                    autoFocus
                    error={errorSubmit || (formik.touched[step.type] && Boolean(formik.errors[step.type]))}
                    label="Campus"
                    sx={{ width: 200 }}
                  >
                    {[
                      <MenuItem value="" key="null">
                        <em>None</em>
                      </MenuItem>,
                      !loading &&
                        menuItems.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.title}
                          </MenuItem>
                        )),
                    ]}
                  </Select>
                  <Box sx={{ mb: 2 }}>
                    <div>
                      <Button disabled={index === 0} onClick={() => handleBack(prevStep)} sx={{ mt: 1, mr: 1 }}>
                        Back
                      </Button>
                      <LoadingButton
                        loading={loading}
                        variant="contained"
                        type={index === steps.length - 1 ? 'submit' : 'button'}
                        disabled={formik.values[step.type] === ''}
                        onClick={() => handleNext(step.type)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </LoadingButton>
                    </div>
                  </Box>
                </FormControl>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
