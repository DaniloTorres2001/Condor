import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { Container, Button } from "@mui/material";
import { urlApi } from "../../utils/constants";
import { sendRequest } from "../../utils/utils";
import OrganizationForm from "./OrganizationForm";
import CustomSnackbar from "../../components/app/CustomSnackbar";

export default function Create() {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState({});
  const { id } = useParams();
  const [snackBar, setSnackBar] = useState({});

  const onOpenSnackbar = (opened, message, type) => {
    setSnackBar({ opened, message, type });
  };

  const onCloseSnackbar = () => {
    setSnackBar({});
  };

  useEffect(() => {
    getOrganization(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getOrganization = async (idOrganization) => {
    const response = await sendRequest(
      `${urlApi}/organizations/${idOrganization}`,
      null,
      "GET",
      true
    );

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        //Importtant
        setOrganization(response);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const handleSubmit = async (data) => {
    const response = await sendRequest(
      `${urlApi}/organizations/${organization?.data?.results.organization.id}`,
      data,
      "PUT",
      true
    );

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        navigate("../", { replace: true });
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  return (
    <>
      <Container maxWidth="xl">
        <CustomSnackbar
          stateSnackbar={snackBar}
          onCloseSnackbar={() => onCloseSnackbar}
        />

        <Button variant="contained" component={RouterLink} to="../">
          Regresar
        </Button>

        <OrganizationForm
          onSubmitForm={handleSubmit}
          updating={true}
          organizationUpdate={organization?.data?.results?.organization}
        />
      </Container>
    </>
  );
}
