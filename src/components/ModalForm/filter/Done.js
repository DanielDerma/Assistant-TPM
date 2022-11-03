import { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { deleteError } from '../../../services/firebaseFunctions';

Done.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onGetErrors: PropTypes.func,
  selectedRow: PropTypes.object,
};

export default function Done({ open, onClose, onGetErrors, selectedRow }) {
  const [confirm, setConfirm] = useState(true);

  const handleConfirm = (e) => {
    if (e === 'terminado') {
      setConfirm(false);
    } else {
      setConfirm(true);
    }
  };

  const handleSubmit = () => {
    const { path } = selectedRow;

    deleteError(path).then(() => {
      setConfirm(true);
      onGetErrors();
      onClose();
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Terminar</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Confirma escribiendo <strong>&quot;terminado&quot;</strong> en el siguiente campo
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
        <Button onClick={handleSubmit} disabled={confirm}>
          Terminado
        </Button>
      </DialogActions>
    </Dialog>
  );
}
