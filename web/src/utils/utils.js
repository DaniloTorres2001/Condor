const responseFormat = (
  error = false,
  message = "",
  data = {},
  redirect = ""
) => {
  return {
    message,
    error,
    data,
    redirect,
  };
};

export const sendRequest = async (
  url = "",
  data = {},
  method = "",
  auth = true,
  files = false
) => {
  try {
    const token = auth ? getUserSession().token : "";

    if (auth && !token) {
      return responseFormat(
        true,
        "Sesión expirada, por favor ingrese de nuevo.",
        null,
        "/login"
      );
    }

    const headers = new Headers();
    if (!files) headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);
    const reqOptions = { method, headers };

    if (method !== "GET" && data)
      reqOptions.body = !files ? JSON.stringify(data) : data;

    const response = await fetch(url, reqOptions);
    const dataResponse = await response.json();
    let redirect;

    if (!response.ok && [401, 403].includes(response.status) && token) {
      localStorage.removeItem("sesion");
      redirect = "/login";
    }

    return responseFormat(false, "Solicitud exitosa", dataResponse, redirect);
  } catch (error) {
    return responseFormat(true, "Conexion Fallida :(", null, null);
  }
};

export const setUserSession = (data) => {
  localStorage.setItem("sesion", JSON.stringify(data));
};

export const getUserSession = () => {
  return JSON.parse(localStorage.getItem("sesion"));
};
