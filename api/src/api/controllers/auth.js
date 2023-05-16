require("dotenv").config();
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { User, Organization} = require("../models");
const { registerValidation, loginValidation } = require("../validations/auth");
const { createToken } = require("../utils/utils");

const {
  successResponse,
  errorResponse,
  validationResponse,
} = require("../utils/responseApi");

const login = async (req, res) => {
  const { error } = loginValidation(req.body);

  if (error)
    return res
      .status(422)
      .json(validationResponse(error.details.map((e) => e.message)));

  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email: username }],
      }, include: [
        Organization
      ]
    });

    if (!user)
      return res
        .status(422)
        .json(validationResponse(["Credenciales inválidas"]));

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res
        .status(422)
        .json(validationResponse(["Credenciales inválidas"]));

    // List roles
    const roles = (await user.getRoles())?.map((r) => r.code) ?? [];

    const token = createToken({
      id: user.id,
      username: user.username,
      codeOrganization: user.codeOrganization,
      roles: roles,
    }, req.body?.mode ? "30d" : "");  
    let userReturn = user.dataValues
    userReturn.roles = roles 
    delete userReturn.password 
    return res.status(200).json(
      successResponse(
        "Login success",
        {
          token,
          user: userReturn,
        },
        res.statusCode
      )
    );
  } catch (err) { 
    console.log(err)
    res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const register = async (req, res) => {
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: req.body.email }, { username: req.body.username }],
    },
  });

  if (user)
    return res.status(400).json({ error: "Email o usuario ya existen" });

  try {
    const savedUser = await User.create(req.body);
    return res.status(201).json({ user: savedUser });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  login,
  register,
};
