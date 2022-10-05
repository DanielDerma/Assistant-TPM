import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { Alert, Grid } from '@mui/material';

import StepperAddCompany from './StepperAddCompany';

FormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default function FormDialog({ open, onClose, title }) {
  return (
    <Dialog open={open} maxWidth="md" fullWidth sx={{ minHeight: 700 }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ height: '90vh' }}>
        <Grid container>
          <Grid item md={6}>
            <StepperAddCompany />
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
