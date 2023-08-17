// eslint-disable-next-line no-undef
require("dotenv").config();
<<<<<<< HEAD
// eslint-disable-next-line no-undef
=======

>>>>>>> 78448d6ab144ef2dab3fcc6b385be2f7f6b9c15b
const express = require("express");
// eslint-disable-next-line no-undef
const helmet = require("helmet");
// eslint-disable-next-line no-undef
const morgan = require("morgan");
// eslint-disable-next-line no-undef
const cors = require("cors");
<<<<<<< HEAD
// eslint-disable-next-line no-undef
=======


>>>>>>> 78448d6ab144ef2dab3fcc6b385be2f7f6b9c15b
const routes = require("./api/routes/index");

const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);
<<<<<<< HEAD
// eslint-disable-next-line no-undef
=======


>>>>>>> 78448d6ab144ef2dab3fcc6b385be2f7f6b9c15b
const PORT = process.env.PORT;

app.listen(PORT);


