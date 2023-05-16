import { useState, useEffect } from "react";

import {
  Stack,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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

export default function Pagos() {
  const [groups, setGroups] = useState([]);
  const [pagos, setPagos] = useState([]);

  

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
    fetchPagos(page, rowsPerPage);
    fetchGroups(page, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);



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
  
  return (
    <Page title="Detalles de Carreras">
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
            Detalles de Carreras
          </Typography>
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
                  <TableCell>Familia</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Valor Carrera</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagos?.pagos?.map((row) => (
                  <TableRow hover
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.groupCode}</TableCell>
                    
                    <TableCell>${row.valor}</TableCell>
                    <TableCell>{row.estado}</TableCell>
                    <TableCell>{row.fechaEmision}</TableCell>
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
      </Container>
    </Page>
  );
}
