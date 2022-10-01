import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AdminContext = createContext();

export function useAdmin() {
  return useContext(AdminContext);
}

AdminProvider.propTypes = {
  children: PropTypes.node,
};

export function AdminProvider({ children }) {
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
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
