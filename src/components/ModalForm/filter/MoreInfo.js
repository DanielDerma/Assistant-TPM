import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import Image from 'mui-image';

TableDelete.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  selectedRow: PropTypes.object,
};

export default function TableDelete({ open, onClose, selectedRow }) {
  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>More Info</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {selectedRow?.description}
          </Typography>
          <Image src={selectedRow?.image ?? ''} shift="top" distance="2rem" shiftDuration={320} sx={{ height: 250 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
