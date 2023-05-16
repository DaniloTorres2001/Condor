const { validateOrganization } = require("../validations/organization");
const { Organization } = require("../models");
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../utils/pagination");

const {
  successResponse,
  errorResponse,
  validationResponse,
} = require("../utils/responseApi");

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

    const { count, rows } = await Organization.findAndCountAll({
      where: condition,
      offset: offset,
      limit: limit,
    });

    const pagination = getPagingData(count, page, limit);

    return res.status(200).json(
      successResponse("Success!", {
        pagination,
        organizations: rows,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const get = async (req, res) => {
  const id = req.params.id;

  try {
    const organization = await Organization.findOne({ where: { id: id } });
    return res.status(200).json(successResponse("Success", { organization }));
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const create = async (req, res) => {
  const { error } = validateOrganization(req.body);

  if (error)
    return res
      .status(422)
      .json(validationResponse(error.details.map((e) => e.message)));

  try {
    const organization = await Organization.findOne({
      where: {
        [Op.or]: { code: req.body.code, name: req.body.name },
      },
    });

    if (organization)
      return res
        .status(422)
        .json(validationResponse(["Código o nombre ya existen."]));

    const savedOrganization = await Organization.create(req.body);

    return res.status(201).json(
      successResponse("Organización creada!", {
        organization: savedOrganization,
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
    const num = await Organization.destroy({ where: { id: id } });

    if (num != 1)
      return res
        .status(400)
        .json(
          validationResponse([`No puede eliminar la organización con id=${id}`])
        );

    return res
      .status(200)
      .json(successResponse("La organización fué eliminada exitosamente.", {}));
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const update = async (req, res) => {
  const { error } = validateOrganization(req.body, true);

  if (error)
    return res
      .status(422)
      .json(validationResponse(error.details.map((e) => e.message)));

  try {
    const id = req.params.id;

    const [num, organizationUpdated] = await Organization.update(req.body, {
      where: { id: id },
      returning: true,
    });

    if (num != 1)
      return res
        .status(400)
        .json(
          validationResponse([
            `No puede actualizar la organización con id=${id}`,
          ])
        );

    return res.status(200).json(
      successResponse("La organización fue actualizada exitosamente.", {
        organization: organizationUpdated,
      })
    );
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

module.exports = {
  getAll,
  get,
  create,
  update,
  destroy,
};
