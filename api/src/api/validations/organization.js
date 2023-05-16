const Joi = require("joi");

const validateOrganization = (data, updating = false) => { 
  const scheme = Joi.object({
    ...(!updating && { code: Joi.string().max(25).required() }),
    name: Joi.string().max(50).required(),
    address: Joi.string().max(100).required(),
  }).options({ abortEarly: false });

  return scheme.validate(data);
};

module.exports = {
  validateOrganization,
};
