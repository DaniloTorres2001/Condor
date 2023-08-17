// eslint-disable-next-line no-undef
require("dotenv").config();
// eslint-disable-next-line no-undef
const express = require("express");
// eslint-disable-next-line no-undef
const helmet = require("helmet");
// eslint-disable-next-line no-undef
const morgan = require("morgan");
// eslint-disable-next-line no-undef
const cors = require("cors");
// eslint-disable-next-line no-undef
const routes = require("./api/routes/index");

const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);
// eslint-disable-next-line no-undef
const PORT = process.env.PORT;

app.listen(PORT);


