import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import PropTypes from 'prop-types';
import { Alert, Grid, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { Box } from '@mui/system';
import ClearIcon from '@mui/icons-material/Clear';
import StepperAddCompany from '../StepperAddCompany';
import StepperManage from '../StepperManage';

AddCompany.propTypes = {
  open: PropTypes.bool.isRequired,
  handleData: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

// formik form is in StepperManage
export default function AddCompany({ open, onClose, title, handleData }) {
  const [stepper, setStepper] = useState([]);

  const closeWithReset = () => {
    onClose();
    setStepper([]);
  };

  return (
    <Dialog open={open} onClose={closeWithReset} maxWidth="md" fullWidth sx={{ minHeight: 700 }}>
      <Box sx={{ mx: 3, mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">{title}</Typography>
        <IconButton color="error" onClick={closeWithReset}>
          <ClearIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ height: '90vh' }}>
        <Grid container spacing={4}>
          {stepper.length === 0 && (
            <Grid item md={12} sm={12}>
              <Alert variant="filled" severity="warning" sx={{ my: 2 }}>
                La estructura de la compañía no se puede modificar una vez creada.
              </Alert>
              <StepperAddCompany onFinish={(steps) => setStepper(steps)} />
            </Grid>
          )}
          <Grid item md={12} sm={12}>
            <StepperManage steps={stepper} handleData={handleData} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
