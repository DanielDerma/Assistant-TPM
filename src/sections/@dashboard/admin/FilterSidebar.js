import { useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
// material
import {
  Box,
  Stack,
  Button,
  Drawer,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  FormControlLabel,
} from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import { getCompanies } from '../../../services/firebaseFunctions';

// ----------------------------------------------------------------------
export const FILTER_COMPANIES = [
  {
    title: 'Administrador',
    id: 'admin',
  },
];

// ----------------------------------------------------------------------

ShopFilterSidebar.propTypes = {
  isOpenFilter: PropTypes.bool,
  onCloseFilter: PropTypes.func,
};

export default function ShopFilterSidebar({ isOpenFilter, onCloseFilter }) {
  const [selected, setSelected] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    getCompanies().then((elem) => {
      setMenuItems(elem);
    });
  }, []);

  const handleReset = () => {
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleClose = () => {
    onCloseFilter(selected);
  };

  const listItems = [...FILTER_COMPANIES, ...menuItems];

  return (
    <>
      <Drawer
        anchor="right"
        open={isOpenFilter}
        onClose={handleClose}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 350 }, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filtros
          </Typography>
          <IconButton onClick={handleClose}>
            <Iconify icon="eva:close-fill" width={20} height={20} />
          </IconButton>
        </Stack>
        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <div>
              <Typography variant="subtitle1" gutterBottom>
                Tipo de compañía
              </Typography>
              <FormGroup>
                {listItems.map((item) => {
                  const isItemSelected = selected.indexOf(item.id) !== -1;
                  return (
                    <FormControlLabel
                      key={item.id}
                      control={<Checkbox />}
                      label={item.title}
                      checked={isItemSelected}
                      onClick={(event) => handleClick(event, item.id)}
                    />
                  );
                })}
              </FormGroup>
            </div>
          </Stack>
        </Scrollbar>
        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={handleReset}
            startIcon={<Iconify icon="ic:round-clear-all" />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
