import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { FormControl, Stack, TextField } from '@mui/material';
import Image from 'mui-image';
import { useFormik } from 'formik';
import Dropzone from './Dropzone';
import { createCourseInitialValues, createCourseValidationSchema } from '../utils/manageValidation';

FormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  steps: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default function FormDialog({ open, onClose, onAdd, title, steps }) {
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
      onAdd(values).then(() => {
        onClose();
        setImgPreview('');
        setActiveStep(0);
        formik.resetForm();
      });
    },
  });

  return (
    <Dialog open={open} maxWidth="md" fullWidth sx={{ minHeight: 700 }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 2 }}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <Stack direction="column">
                    <FormControl sx={{ m: 1 }}>
                      <TextField
                        value={formik.values[step.type].title}
                        onChange={(event) => {
                          formik.setFieldValue(`${step.type}.title`, event.target.value);
                        }}
                        error={formik.touched[step.type.title] && Boolean(formik.errors[step.type.title])}
                        variant="standard"
                        id="standard-basic"
                        label="Titulo"
                        sx={{ width: '100%' }}
                      />
                      <TextField
                        value={formik.values[step.type].description}
                        onChange={(event) => {
                          formik.setFieldValue(`${step.type}.description`, event.target.value);
                        }}
                        error={formik.touched[step.type.description] && Boolean(formik.errors[step.type.description])}
                        variant="standard"
                        id="standard-basic2"
                        label="Descripción"
                        sx={{ width: '100%' }}
                      />
                    </FormControl>
                    <Box sx={{ width: '100%' }}>
                      <Dropzone
                        onFinish={(image) => handleImage(`${step.type}.image`, image)}
                        onPreview={handleImagePreview}
                      />
                      <Image
                        src={imgPreview}
                        shift="top"
                        distance="2rem"
                        shiftDuration={320}
                        height={300}
                        fit="contain"
                      />
                    </Box>
                  </Stack>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <div>
                      <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                        Back
                      </Button>
                      <LoadingButton
                        variant="contained"
                        type={index === steps.length - 1 ? 'submit' : 'button'}
                        disabled={formik.values[step.type] === ''}
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </LoadingButton>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={formik.handleSubmit}>Añadir</Button>
      </DialogActions>
    </Dialog>
  );
}
