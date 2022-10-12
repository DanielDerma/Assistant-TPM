import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { Alert, Grid } from '@mui/material';

import StepperAddCompany from '../StepperAddCompany';
import StepperManage from '../StepperManage';
import { createFromCompany } from '../../services/firebaseFunctions';

FormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default function FormDialog({ open, onClose, title }) {
  const handleCloseWithReset = () => {
    onClose();
  };

  const handleAddManage = async () => {};

  return (
    <Dialog open={open} onClose={handleCloseWithReset} maxWidth="md" fullWidth sx={{ minHeight: 700 }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ height: '90vh' }}>
        <Grid container spacing={4}>
          <Grid item md={12} sm={12}>
            <StepperManage onAdd={handleAddManage} steps={{}} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseWithReset}>Close</Button>
        <Button onClick={handleCloseWithReset}>Añadir</Button>
      </DialogActions>
    </Dialog>
  );
}
