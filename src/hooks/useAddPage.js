import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AddContext = createContext();

export function useAdd() {
  return useContext(AddContext);
}

AddProvider.propTypes = {
  children: PropTypes.node,
};

export function AddProvider({ children }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const value = {
    open,
    handleOpen,
    handleClose,
  };
  return <AddContext.Provider value={value}>{children}</AddContext.Provider>;
}
