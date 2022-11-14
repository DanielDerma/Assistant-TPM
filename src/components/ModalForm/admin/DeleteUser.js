import { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { deleteUser } from '../../../services/firebaseFunctions';
import useAuth from '../../../hooks/useAuth';

TableDelete.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  preview: PropTypes.object,
  onFinish: PropTypes.func,
};

export default function TableDelete({ open, onClose, preview, onFinish }) {
  const [confirm, setConfirm] = useState(true);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleConfirm = (e) => {
    if (e === preview?.email) {
      setConfirm(false);
    } else {
      setConfirm(true);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    const { email } = preview;
    deleteUser(email, currentUser).then(() => {
      onFinish();
      setConfirm(true);
      setLoading(false);
      onClose();
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Confirma escribiendo <strong>&quot;{preview?.email}&quot;</strong> en el siguiente campo
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
        <LoadingButton loading={loading} onClick={handleSubmit} disabled={confirm}>
          Eliminar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
