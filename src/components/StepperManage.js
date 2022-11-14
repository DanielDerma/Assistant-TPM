import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import PropTypes from 'prop-types';
import { FormControl, TextField } from '@mui/material';
import Image from 'mui-image';
import { useFormik } from 'formik';
import Dropzone from './Dropzone';
import { createCourseInitialValues, createCourseValidationSchema } from '../utils/manageValidation';
import { createFromCompany } from '../services/firebaseFunctions';

StepperManage.propTypes = {
  steps: PropTypes.array,
  handleData: PropTypes.func,
  onClose: PropTypes.func,
};

export default function StepperManage({ steps, handleData, onClose }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [imgPreview, setImgPreview] = React.useState('');

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setImgPreview('');
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleImage = (path, img) => {
    formik.setFieldValue(path, img);
  };

  const handleImagePreview = (image) => {
    setImgPreview(URL.createObjectURL(image));
  };

  const formik = useFormik({
    initialValues: createCourseInitialValues(steps),
    validationSchema: createCourseValidationSchema(steps),
    onSubmit: (values) => {
      createFromCompany(values)
        .then((elem) => {
          console.log(elem);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          handleData();
          onClose();
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box>
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 2 }}>
          {steps.map((step, index) => {
            const val = index !== 0 ? `subnivel${index}` : 'company';
            const formikValue = formik.values[val];
            const formikTouched = formik.touched[val];
            const formikErrors = formik.errors[val];
            return (
              <Step key={step.id}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <FormControl sx={{ m: 1, width: '100%' }}>
                    <TextField
                      value={formikValue?.title}
                      onChange={(event) => {
                        console.log(event.target.value);
                        formik.setFieldValue(`${val}.title`, event.target.value);
                        formik.setFieldValue(`${val}.label`, step.label);
                      }}
                      error={formikTouched?.title && Boolean(formikErrors?.title)}
                      variant="standard"
                      id="standard-basic"
                      label="Titulo"
                      fullWidth
                    />
                    <TextField
                      value={formikValue?.description}
                      onChange={(event) => {
                        formik.setFieldValue(`${val}.description`, event.target.value);
                      }}
                      error={formikTouched?.description && Boolean(formikErrors?.description)}
                      variant="standard"
                      id="standard-basic2"
                      label="Descripción"
                      fullWidth
                    />
                  </FormControl>
                  <Box sx={{ width: '100%' }}>
                    <Dropzone onFinish={(image) => handleImage(`${val}.image`, image)} onPreview={handleImagePreview} />
                    <Image
                      src={imgPreview}
                      shift="top"
                      distance="2rem"
                      shiftDuration={320}
                      height={300}
                      fit="contain"
                    />
                  </Box>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <div>
                      <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                        Back
                      </Button>
                      <LoadingButton
                        variant="contained"
                        type={index === steps.length - 1 ? 'submit' : 'button'}
                        disabled={formikErrors?.title || formikErrors?.description}
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </LoadingButton>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    </form>
  );
}
