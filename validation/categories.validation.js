const Joi = require("joi");
exports.categoryValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
  });

  return schema.validate(body);
};
