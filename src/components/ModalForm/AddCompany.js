import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { Alert, Grid } from '@mui/material';
import { useState } from 'react';

import StepperAddCompany from '../StepperAddCompany';
import StepperManage from '../StepperManage';
import { createFromCompany } from '../../services/firebaseFunctions';

AddCompany.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default function AddCompany({ open, onClose, title }) {
  const [stepper, setStepper] = useState([]);

  const handleAddManage = (data) => {
    console.log(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ minHeight: 700 }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ height: '90vh' }}>
        <Grid container spacing={4}>
          <Grid item md={12} sm={12}>
            <Alert variant="filled" severity="warning" sx={{ my: 2 }}>
              La estructura de la compañía no se puede modificar una vez creada.
            </Alert>
            <StepperAddCompany onFinish={(steps) => setStepper(steps)} />
          </Grid>
          <Grid item md={12} sm={12}>
            <StepperManage onAdd={handleAddManage} steps={stepper} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={onClose}>Añadir</Button>
      </DialogActions>
    </Dialog>
  );
}
