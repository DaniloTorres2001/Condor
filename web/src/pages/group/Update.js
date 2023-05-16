import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { Container, Button } from "@mui/material";
import { urlApi } from "../../utils/constants";
import { sendRequest } from "../../utils/utils";
import GroupForm from "./GroupForm";

import CustomSnackbar from "../../components/app/CustomSnackbar";

export default function Update() {
  const navigate = useNavigate();
  const [group, setGroup] = useState({});
  const { id } = useParams();

  const [snackBar, setSnackBar] = useState({});

  const onOpenSnackbar = (opened, message, type) => {
    setSnackBar({ opened, message, type });
  };

  const onCloseSnackbar = () => {
    setSnackBar({});
  };

  useEffect(() => {
    getGroup(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getGroup = async (idGroup) => {

    const response = await sendRequest(
      `${urlApi}/groups/${idGroup}`,
      null,
      "GET",
      true
    );

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        //Importtant
        setGroup(response.data?.results?.group);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const obSubmitForm = async (data) => {
    const response = await sendRequest(
      `${urlApi}/groups/${group?.id}`,
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
        alert(errorMessage);
      }
    } else {
      alert(response.message);
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

        <GroupForm
          onSubmitForm={obSubmitForm}
          groupUpdate={group}
          updating={true}
        />
      </Container>
    </>
  );
}
