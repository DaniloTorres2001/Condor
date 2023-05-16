const { Pago} = require("../models");
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../utils/pagination");


const {
  successResponse,
  errorResponse,
} = require("../utils/responseApi");

const getAll = async (req, res) => {
  try {
    const { page, size, search } = req.query;
    const condition = search
      ? {
          [Op.or]: [
            { estado: { [Op.startsWith]: search } },
            { groupCode: { [Op.startsWith]: search } },
            
          ],
        }
      : null;

    const { limit, offset } = getPagination(page, size);

    const { count, rows } = await Pago.findAndCountAll({
      where: {
        ...condition,
      },
      offset: offset,
      limit: limit,
    });

    const pagination = getPagingData(count, page, limit);

    return res.status(200).json(
      successResponse("Success!", {
        pagination,
        pagos: rows,
      })
    );
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const getAllDates = async (req, res) => {
  try {
    const { page, size, search } = req.query;
    const condition = search
      ? {
        [Op.and]: [
          { fechaEmision: { [Op.gte]: new Date(search + '-01') } }, // busca a partir del primer día del mes
          { fechaEmision: { [Op.lt]: new Date(moment(search + '-01').add(1, 'months')) } } // busca hasta el último día del mes
        ],
          [Op.or]: [
            { estado: { [Op.startsWith]: search } },
            { groupCode: { [Op.startsWith]: search } },
            
          ],
        }
      : null;

    const { limit, offset } = getPagination(page, size);

    const { count, rows } = await Pago.findAndCountAll({
      where: {
        ...condition,
      },
      offset: offset,
      limit: limit,
    });

    const pagination = getPagingData(count, page, limit);

    return res.status(200).json(
      successResponse("Success!", {
        pagination,
        pagos: rows,
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
    const pago = await Pago.findOne({ where: { id: id } });
    return res.status(200).json(successResponse("Success", { pago }));
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};


module.exports = {
  getAll,
  get,
};
