require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");


const routes = require("./api/routes/index");

const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);


const PORT = process.env.PORT;

app.listen(PORT);


