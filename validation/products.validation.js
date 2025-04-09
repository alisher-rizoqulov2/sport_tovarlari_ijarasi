const Joi = require("joi");
exports.productValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    categoryId: Joi.number().required(),
    ownerId: Joi.number().required(),
    price_per_day: Joi.number().required(),
    available: Joi.boolean().optional(),
    photo: Joi.string().uri().optional(),
    price: Joi.number().optional(),
    description: Joi.string().optional(),
  });

  return schema.validate(body);
};
