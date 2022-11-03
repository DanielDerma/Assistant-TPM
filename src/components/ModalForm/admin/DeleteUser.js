import { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { deleteUser } from '../../../services/firebaseFunctions';

TableDelete.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  preview: PropTypes.object,
};

export default function TableDelete({ open, onClose, preview }) {
  const [confirm, setConfirm] = useState(true);

  const handleConfirm = (e) => {
    if (e === 'eliminar') {
      setConfirm(false);
    } else {
      setConfirm(true);
    }
  };

  const handleSubmit = () => {
    const { email } = preview;
    deleteUser(email).then(() => {
      setConfirm(true);
      onClose();
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Confirma escribiendo <strong>&quot;eliminar&quot;</strong> en el siguiente campo
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
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
