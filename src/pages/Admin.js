import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material
import {
  Card,
  Table,
  Stack,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Button,
} from '@mui/material';
import Iconify from '../components/Iconify';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import FormAddNewUser from '../components/ModalForm/AddUser';
import FormEditUser from '../components/ModalForm/EditUser';
import FormDeleteUser from '../components/ModalForm/DeleteUser';
import { UserListHead, UserListToolbar, UserMoreMenu, FilterSidebar } from '../sections/@dashboard/admin';
// mock
import { getUsers } from '../services/firebaseFunctions';
import FieldPassword from '../components/FieldPassword';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'company', label: 'Compañía', alignRight: false },
  { id: 'fname', label: 'Nombre', alignRight: false },
  { id: 'lname', label: 'Apellido', alignRight: false },
  { id: 'age', label: 'Edad', alignRight: false },
  { id: 'contact_add', label: 'Teléfono', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'password', label: 'Contraseña', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.fname.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openFilter, setOpenFilter] = useState(false);

  const [openNewUser, setOpenNewUser] = useState(false);

  const [preview, setPreview] = useState(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUsers().then((data) => {
      console.log(data);
      setData(data);
      setLoading(false);
    });
  }, []);

  const handleOpenDelete = (email) => {
    setPreview(email);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setPreview(null);
    setOpenDelete(false);
  };

  const handleOpenEdit = (p) => {
    setPreview(p);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setPreview(null);
    setOpenEdit(false);
  };

  const handleOpenNewUser = () => setOpenNewUser(true);
  const handleCloseNewUser = () => setOpenNewUser(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.email);
      setSelected(newSelecteds);
      return;
    }
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Page title="Admin">
      <FormAddNewUser open={openNewUser} onClose={handleCloseNewUser} />
      <FormEditUser open={openEdit} onClose={handleCloseEdit} preview={preview} />
      <FormDeleteUser open={openDelete} onClose={handleCloseDelete} preview={preview} />
      <FilterSidebar isOpenFilter={openFilter} onCloseFilter={handleCloseFilter} />
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Admin</Typography>
          <Button
            onClick={handleOpenNewUser}
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New User
          </Button>
        </Stack>
        <Card>
          <UserListToolbar
            onOpenFilter={handleOpenFilter}
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={data.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { fname, lname, age, contactAdd, email, company, password } = row;
                    const isItemSelected = selected.indexOf(email) !== -1;

                    return (
                      <TableRow
                        hover
                        key={email}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, email)} />
                        </TableCell>
                        <TableCell align="left">{!company ? 'Admin' : company}</TableCell>
                        <TableCell align="left">{fname}</TableCell>
                        <TableCell align="left">{lname}</TableCell>
                        <TableCell align="left">{age}</TableCell>
                        <TableCell align="left">{contactAdd}</TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">
                          <FieldPassword password={password} />
                        </TableCell>

                        <TableCell align="right">
                          <UserMoreMenu onOpenDelete={handleOpenDelete} onOpenEdit={handleOpenEdit} row={row} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
