import { filter } from 'lodash';
import { useState, useEffect } from 'react';

// material
import {
  Card,
  Table,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
// components
import Alert from '../components/Alert';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu, FilterSidebar } from '../sections/@dashboard/user';
import { Done, DoneAll, MoreInfo } from '../components/ModalForm/filter';
// mock
import { getLocation, getSubCollectionErrors } from '../services/firebaseFunctions';
import useAuth from '../hooks/useAuth';

// ----------------------------------------------------------------------

const DEFAULT_TABLE_HEAD = [
  { id: 'date', label: 'Fecha', alignRight: false },
  { id: 'time', label: 'hora', alignRight: false },
  { id: 'type', label: 'Tipo', alignRight: false },
  { id: 'risk', label: 'Anomalía', alignRight: false },
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

function applySortFilter(array, config, comparator, query) {
  const arrayConfigWithCards = array.filter((elem) => config.cards.some((e) => e === elem.type));
  const arrayConfigWithCardsAndRisks = arrayConfigWithCards.filter((elem) => config.risk.some((e) => e === elem.risk));

  const stabilizedThis = arrayConfigWithCardsAndRisks.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(arrayConfigWithCardsAndRisks, (item) => item.id.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User({ isAdmin }) {
  const { company } = useAuth();
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('company');

  const [filterLocation, setFilterLocation] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedRow, setSelectedRow] = useState({});

  const [openFilter, setOpenFilter] = useState(false);
  const [openDeleteAll, setOpenDeleteAll] = useState(false);
  const [openMoreInfo, setOpenMoreInfo] = useState(false);
  const [openDone, setOpenDone] = useState(false);

  const [headers, setHeaders] = useState([]);

  const [data, setData] = useState([]);

  const [config, setConfig] = useState({
    cards: ['maintenance', 'operation', 'security'],
    risk: [10, 20, 30, 40, 50],
  });

  const [loading, setLoading] = useState(true);

  const [openAlert, setOpenAlert] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');

  useEffect(() => {
    getErrors();
  }, []); //  eslint-disable-line react-hooks/exhaustive-deps

  const getErrors = () => {
    setLoading(true);
    getSubCollectionErrors(company.title).then((data) => {
      setSelected([]);
      setData(data);
      setLoading(false);
    });
  };

  const handleFinishDone = (id) => {
    setOpenDone(false);
    setOpenAlert(true);
    setMsgAlert(`Se ha realizado la tarea con éxito, id: ${id}`);
    getErrors();
  };

  const handleFinishDoneAll = (paths) => {
    const pathsSelected = filteredUsers.filter((elem) => paths.some((e) => e === elem.path));
    const selectedElements = pathsSelected.map((e) => e.id);
    const selectedElementsString = selectedElements.join(', ');

    setOpenDone(false);
    setOpenAlert(true);
    setMsgAlert(`Se ha realizado la tareas con éxito, ids: ${selectedElementsString}`);
    getErrors();
  };

  useEffect(() => {
    getLocation(company.id)
      .then((steps) => {
        const headers = steps.map((step, i) => ({ id: i, label: step, alignRight: false }));
        setHeaders(headers);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredUsers.map((n) => n.path);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, location) => {
    const selectedIndex = selected.indexOf(location);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, location);
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

  const handleFilterByLocation = (event) => {
    setFilterLocation(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredUsers = applySortFilter(data, config, getComparator(order, orderBy), filterLocation);

  const isUserNotFound = filteredUsers.length === 0;

  const headersTable = [{ id: 'id', label: 'Folio', alignRight: false }, ...headers, ...DEFAULT_TABLE_HEAD];

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = (config) => {
    setConfig(config);
    setOpenFilter(false);
  };

  const handleCloseDeleteAll = () => {
    setOpenDeleteAll(false);
  };

  const handleOpenDeleteAll = () => {
    setOpenDeleteAll(true);
  };

  const handleOpenMoreInfo = () => {
    setOpenMoreInfo(true);
  };

  const handleCloseMoreInfo = () => {
    setOpenMoreInfo(false);
  };

  const handleOpenDone = () => {
    setOpenDone(true);
  };

  const handleCloseDone = () => {
    setOpenDone(false);
  };
  const handleCloseAlert = () => setOpenAlert(false);

  console.log(selected);

  return (
    <Page title="Filtrado">
      <Alert open={openAlert} onClose={handleCloseAlert} severity="success">
        {msgAlert}
      </Alert>
      <FilterSidebar isOpenFilter={openFilter} onCloseFilter={handleCloseFilter} />
      <MoreInfo open={openMoreInfo} onClose={handleCloseMoreInfo} selectedRow={selectedRow} />
      <Done open={openDone} onClose={handleCloseDone} selectedRow={selectedRow} onFinish={handleFinishDone} />
      <DoneAll open={openDeleteAll} onClose={handleCloseDeleteAll} selected={selected} onFinish={handleFinishDoneAll} />
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Filtrado
        </Typography>
        <Card>
          <UserListToolbar
            onDeleteAll={handleOpenDeleteAll}
            onOpenFilter={handleOpenFilter}
            numSelected={selected.length}
            filterLocation={filterLocation}
            onFilterLocation={handleFilterByLocation}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={headersTable}
                  rowCount={filteredUsers.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { risk, date, time, id, structure, type, path } = row;
                    const isItemSelected = selected.indexOf(path) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, path)} />
                        </TableCell>
                        <TableCell align="left">{id}</TableCell>
                        {structure.map((item) => (
                          <TableCell align="left" key={item}>
                            {item}
                          </TableCell>
                        ))}
                        <TableCell align="left">{date}</TableCell>
                        <TableCell align="left">{time}</TableCell>
                        <TableCell align="left">{type}</TableCell>
                        <TableCell align="left">{risk}</TableCell>

                        <TableCell align="right" onClick={() => setSelectedRow(row)}>
                          <UserMoreMenu onOpenDone={handleOpenDone} onOpenMoreInfo={handleOpenMoreInfo} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={9} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={9} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterLocation} />
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
            count={filteredUsers.length}
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
