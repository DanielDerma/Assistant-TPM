import { useState } from 'react';
import PropTypes from 'prop-types';

import { LoadingButton } from '@mui/lab';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { deleteAllError } from '../../../services/firebaseFunctions';

DoneAll.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onGetErrors: PropTypes.func,
  selected: PropTypes.array,
};

export default function DoneAll({ open, onClose, selected, onGetErrors }) {
  const [confirm, setConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleConfirm = (e) => {
    if (e === 'eliminar todo') {
      setConfirm(false);
    } else {
      setConfirm(true);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    deleteAllError(selected).then(() => {
      onGetErrors();
      setLoading(false);
      onClose();
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Terminar Todo</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Confirma escribiendo <strong>&quot;eliminar todo&quot;</strong> en el siguiente campo
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Confirmar"
          type="text"
          fullWidth
          variant="standard"
          error={Boolean(confirm)}
          onChange={(e) => handleConfirm(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton loading={loading} onClick={handleSubmit} disabled={confirm} variant="contained" color="error">
          Terminado
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
