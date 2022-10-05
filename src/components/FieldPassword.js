import { Box, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Iconify from './Iconify';

const FieldPassword = ({ password }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography sx={{ flexGrow: 1 }}>{showPassword ? password : '****************'}</Typography>
      <IconButton onClick={() => setShowPassword(!showPassword)}>
        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
      </IconButton>
    </Box>
  );
};

FieldPassword.propTypes = {
  password: PropTypes.string.isRequired,
};

export default FieldPassword;
