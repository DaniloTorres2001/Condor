const Joi = require("joi");

const pagosValidation = (data, updating = false) => {
  const schema = Joi.object({
    valor: Joi.number().required(),
    fechaEmision: Joi.date().required(),
    estado: Joi.string().max(10).required(),
    // groupCode: Joi.string().max(25).required(),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

module.exports = {
    pagosValidation,
  };
  