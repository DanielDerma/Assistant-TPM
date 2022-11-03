import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { FormControl, MenuItem, Select } from '@mui/material';
import PropTypes from 'prop-types';
import { getFeed, getLocation } from '../services/firebaseFunctions';
import useAuth from '../hooks/useAuth';

FormDialog.propTypes = {
  onFinish: PropTypes.func,
  errorSubmit: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

export default function FormDialog({ onFinish, errorSubmit, fullWidth = false }) {
  const { company } = useAuth();
  const [activeStep, setActiveStep] = React.useState(0);
  const [value, setValue] = React.useState('');
  const [valueId, setValueId] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [menuItems, setMenuItems] = React.useState([]);
  const [arrayCompany, setArrayCompany] = React.useState([{ id: company.id, title: company.title }]);

  const [steps, setSteps] = React.useState([]);

  React.useEffect(() => {
    getLocation(company.id)
      .then((steps) => {
        const stepsForForm = steps.slice(1);
        setSteps(stepsForForm);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    getMenuItems(arrayCompany);
  }, [arrayCompany]);

  const getMenuItems = async (data) => {
    setLoading(true);
    try {
      const res = await getFeed(data);
      setMenuItems(res);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleNext = (isSubmit) => {
    if (!isSubmit) {
      setArrayCompany([...arrayCompany, valueId]);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setValue('');
    }
  };

  const handleBack = () => {
    const newArrayCompany = arrayCompany.slice(0, -1);
    setArrayCompany(newArrayCompany);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    onFinish([...arrayCompany, valueId], steps);
  };

  const handleValueId = (selectedTitle) => {
    const { id, label, title } = menuItems.find((item) => item.title === selectedTitle);
    setValueId({ id, title });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 2 }}>
        {steps.map((step, index) => {
          const isSubmit = index === steps.length - 1;
          const prevStep = steps[index - 2] ? steps[index - 2].type : null;
          return (
            <Step key={step}>
              <StepLabel>{step}</StepLabel>
              <StepContent>
                <FormControl
                  variant="standard"
                  sx={{ m: 1 }}
                  component="form"
                  onSubmit={handleSubmit}
                  fullWidth={fullWidth}
                >
                  <Select
                    labelId="campus"
                    id={step}
                    value={value}
                    onChange={(event) => {
                      setValue(event.target.value);
                    }}
                    error={errorSubmit}
                    autoFocus
                    label="Campus"
                    sx={{ width: fullWidth ? '100%' : 200 }}
                  >
                    {[
                      <MenuItem value="" key="null">
                        <em>None</em>
                      </MenuItem>,
                      !loading &&
                        menuItems.map((item) => (
                          <MenuItem key={item.id} value={item.title} onClick={() => handleValueId(item.title)}>
                            {item.title}
                          </MenuItem>
                        )),
                    ]}
                  </Select>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div>
                      <Button disabled={index === 0} onClick={() => handleBack(prevStep)} sx={{ mt: 1, mr: 1 }}>
                        Back
                      </Button>
                      <LoadingButton
                        loading={loading}
                        variant="contained"
                        type={isSubmit ? 'submit' : 'button'}
                        onClick={() => handleNext(isSubmit)}
                        disabled={loading || value === ''}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {isSubmit ? 'Finish' : 'Continue'}
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
