const Joi = require("joi");
exports.statusValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  return schema.validate(body);
};
