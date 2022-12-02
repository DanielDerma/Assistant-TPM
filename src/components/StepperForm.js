import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { FormControl, MenuItem, Select, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import { getFeed, getLocation } from '../services/firebaseFunctions';
import useAuth from '../hooks/useAuth';

FormDialog.propTypes = {
  onFinish: PropTypes.func,
  errorSubmit: PropTypes.bool,
  fullWidth: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

export default function FormDialog({ onFinish, errorSubmit, fullWidth = false, isAdmin }) {
  const { company } = useAuth();
  const [activeStep, setActiveStep] = React.useState(0);
  const [value, setValue] = React.useState('');
  const [valueId, setValueId] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loadingBtn, setLoadingBtn] = React.useState(true);
  const [menuItems, setMenuItems] = React.useState([]);
  const [arrayCompany, setArrayCompany] = React.useState(!isAdmin ? [{ id: company.id, title: company.title }] : []);
  const [steps, setSteps] = React.useState([]);

  React.useEffect(() => {
    if (isAdmin) {
      setSteps(['company']);
      return;
    }
    getLocations(company.id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    console.log({ arrayCompany });
    getMenuItems(arrayCompany);
  }, [arrayCompany]);

  const getLocations = async (id) => {
    setLoading(true);
    getLocation(id)
      .then((stepsDoc) => {
        const stepsForForm = stepsDoc.slice(1);
        setSteps([...steps, ...stepsForForm]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getMenuItems = async (data) => {
    setLoadingBtn(true);
    try {
      const res = await getFeed(data);
      setMenuItems(res);
      setLoadingBtn(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleNext = (isSubmit) => {
    if (isSubmit && isAdmin && activeStep === 0) {
      getLocations(valueId.id);
      setArrayCompany([...arrayCompany, valueId]);
    }
    if (!isSubmit) {
      setArrayCompany([...arrayCompany, valueId]);
    }
    if (isSubmit) {
      onFinish([...arrayCompany, valueId]);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setValue('');
  };

  const handleBack = () => {
    const newArrayCompany = arrayCompany.slice(0, -1);
    setArrayCompany(newArrayCompany);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleValueId = (selectedTitle) => {
    const { id, title } = menuItems.find((item) => item.title === selectedTitle);
    setValueId({ id, title });
  };

  if (loading) {
    return (
      <Box sx={{ width: '90%' }}>
        <Skeleton sx={{ mb: 1, height: 40 }} />
        <Skeleton sx={{ mb: 1, height: 40 }} />
        <Skeleton sx={{ mb: 1, height: 40 }} />
      </Box>
    );
  }

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
                <FormControl variant="standard" sx={{ m: 1 }} component="form" fullWidth={fullWidth}>
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
                      !loadingBtn &&
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
