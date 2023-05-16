import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink } from "react-router-dom";

import {
  Stack,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  TablePagination,
  Card,
} from "@mui/material";

import SearchBar from "../../components/SearchBarTable";
import MonthBar from "../../components/MonthBarTable";

import TableMoreMenu from "../../components/_dashboard/TableMoreMenu";

import Page from "../../components/app/Page";
import { urlApi } from "../../utils/constants";
import { sendRequest } from "../../utils/utils";

import CustomSnackbar from "../../components/app/CustomSnackbar";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState({});

  

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [snackBar, setSnackBar] = useState({});

  const onOpenSnackbar = (opened, message, type) => {
    setSnackBar({ opened, message, type });
  };

  const onCloseSnackbar = () => {
    setSnackBar({});
  };

  useEffect(() => {
    fetchGroups(page, rowsPerPage);
    fetchPagos(page, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const fetchGroups = async (pages, row, filterSearch) => {
    const condition = filterSearch ? `&search=${filterSearch}` : "";

    const response = await sendRequest(
      `${urlApi}/groups?page=${pages}&size=${row}${condition}`,
      null,
      "GET",
      true
    );

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        setGroups(response.data?.results);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const fetchPagos = async (pages, row, filterSearch) => {
    const condition = filterSearch ? `&search=${filterSearch}` : "";

    const response = await sendRequest(
      `${urlApi}/pagos?page=${pages}&size=${row}${condition}`,
      null,
      "GET",
      true
    );

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        setPagos(response.data?.results);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const handleOpenDeleteDialog = (group) => {
    setSelectedGroup(group);
    setDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterSearch = (filterSearch) => {
    fetchPagos(page, rowsPerPage, filterSearch);
  };

  const handleDeleteGroup = async () => {
    const response = await sendRequest(
      `${urlApi}/groups/${selectedGroup.id}`,
      null,
      "DELETE",
      true
    );

    setDeleteDialog(false);

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        fetchGroups(page, rowsPerPage);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const ConfirmDelete = (
    <Dialog
      open={deleteDialog}
      onClose={handleCloseDeleteDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Está seguro de eliminar el grupo "{selectedGroup?.name}"?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Si da click en 'aceptar', el grupo se eliminará de manera definitiva y
          no se podrán revertir los cambios.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
        <Button onClick={handleDeleteGroup} autoFocus>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Page title="Familias">
      <Container>
        <CustomSnackbar
          stateSnackbar={snackBar}
          onCloseSnackbar={() => onCloseSnackbar}
        />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Familias
          </Typography>
          <Button
            component={RouterLink}
            to="create"
            variant="contained"
            startIcon={<Icon icon={plusFill} />}
          >
            Crear
          </Button>
        </Stack>
        {/* Content */}

        <Card>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <SearchBar onFetchData={handleFilterSearch} />
          <MonthBar />
        </div>
          
          
          
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Alicuota</TableCell>
                  <TableCell>Carreras Solicitadas</TableCell>
                  <TableCell>Carreras Realizadas</TableCell>
                  <TableCell>Total a Pagar</TableCell>
                  <TableCell>Opciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups?.groups?.map((row) => (
                  <TableRow hover
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{row.id}</TableCell>
                    <TableCell component="th" scope="row">
                      {row.code}
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>${row.alicuota}</TableCell>
                    <TableCell>
                      $
                      {pagos?.pagos?.reduce((acc, row2) => {
                        if (row2.groupCode === row.code && row2.estado === "pasajero") {
                          return acc + Number(row2.valor);
                        }
                        return acc;
                      }, 0)}
                    </TableCell>
                    <TableCell>
                      $
                      {pagos?.pagos?.reduce((acc, row2) => {
                        if (row2.groupCode === row.code && row2.estado === "conductor") {
                          return acc + Number(row2.valor);
                        }
                        return acc;
                      }, 0)}
                    </TableCell>
                    <TableCell>$
                      {Number(row.alicuota) + Number(pagos?.pagos?.reduce((acc, row2) => {
                          if (row2.groupCode === row.code && row2.estado === "pasajero") {
                              return acc + Number(row2.valor);
                          }
                          return acc;
                      }, 0)) - Number(pagos?.pagos?.reduce((acc, row2) => {
                          if (row2.groupCode === row.code && row2.estado === "conductor") {
                              return acc + Number(row2.valor);
                          }
                          return acc;
                      }, 0))}
                    </TableCell>
                    <TableCell style={{ width: 40 }} align="left">
                      <TableMoreMenu
                        onDelete={() => handleOpenDeleteDialog(row)}
                        updateLink={`update/${row.id}`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={groups?.pagination?.totalItems ?? 0}
            page={page}
            labelRowsPerPage={"Items por página"}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        {ConfirmDelete}
      </Container>
    </Page>
  );
}
