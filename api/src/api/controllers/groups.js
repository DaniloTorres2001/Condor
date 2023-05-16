const { User, Group, UserGroup, Organization } = require("../models");
const { Op } = require("sequelize");
const { groupValidation } = require("../validations/group");
const { getPagination, getPagingData } = require("../utils/pagination");

const {
  successResponse,
  errorResponse,
  validationResponse,
} = require("../utils/responseApi");

const create = async (req, res) => {
  const { error } = groupValidation(req.body);

  if (error)
    return res
      .status(422)
      .json(validationResponse(error.details.map((e) => e.message)));

  const group = await Group.findOne({
    where: {
      [Op.or]: [{ code: req.body.code }, { name: req.body.name }],
    },
  });

  if (group)
    return res
      .status(422)
      .json(validationResponse(["Código o nombre ya existe"]));

  const organization = await Organization.findOne({
    where: { code: req.user.codeOrganization },
  });

  if (!organization)
    return res
      .status(400)
      .json(validationResponse(["La organización no existe"]));

  try {
    const savedGroup = await Group.create({
      code: req.body.code,
      name: req.body.name,
      address: req.body.address,
      alicuota : req.body.alicuota,
      codeOrganization: req.user.codeOrganization,
    });

    return res.status(201).json(
      successResponse("group created!", {
        group: savedGroup,
      })
    );
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const destroy = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Group.destroy({ where: { id: id } });

    if (num != 1)
      return res
        .status(400)
        .json(validationResponse([`No puede eliminar el grupo con id=${id}`]));

    return res
      .status(200)
      .json(successResponse("El grupo fué eliminado exitosamente.", {}));
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const getAll = async (req, res) => {
  try {
    const { page, size, search } = req.query;
    const condition = search
      ? {
          [Op.or]: [
            { name: { [Op.startsWith]: search } },
            { code: { [Op.startsWith]: search } },
          ],
        }
      : null;

    const { limit, offset } = getPagination(page, size);

    const { count, rows } = await Group.findAndCountAll({
      where: {
        ...condition,
        ...(req?.user?.codeOrganization && {
          codeOrganization: req.user.codeOrganization,
        }),
      },
      offset: offset,
      limit: limit,
    });

    const pagination = getPagingData(count, page, limit);

    return res.status(200).json(
      successResponse("Success!", {
        pagination,
        groups: rows,
      })
    );
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const get = async (req, res) => {
  const id = req.params.id;

  try {
    const group = await Group.findOne({ where: { id: id } });
    return res.status(200).json(successResponse("Success", { group }));
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const update = async (req, res) => {
  const { error } = groupValidation(req.body, true);

  if (error)
    return res
      .status(422)
      .json(validationResponse(error.details.map((e) => e.message)));

  try {
    const id = req.params.id;

    const [num, groupUpdated] = await Group.update(req.body, {
      where: { id: id },
      returning: true,
    });

    // Validate if organization exist

    if (num != 1)
      return res
        .status(400)
        .json(
          validationResponse([`No puede actualizar el grupo con id=${id}`])
        );

    return res.status(200).json(
      successResponse("El grupo fué actualizado exitosamente.", {
        group: groupUpdated,
      })
    );
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

module.exports = {
  create,
  getAll,
  get,
  destroy,
  update,
};
