import React from 'react';
import PropTypes from 'prop-types';

import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const AlertComponent = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

Alert.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  severity: PropTypes.oneOf(['error', 'info', 'success', 'warning']),
};

export default function Alert({ open, onClose, children, severity }) {
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <AlertComponent onClose={onClose} severity={severity} sx={{ width: '100%' }}>
          {children}
        </AlertComponent>
      </Snackbar>
    </>
  );
}
