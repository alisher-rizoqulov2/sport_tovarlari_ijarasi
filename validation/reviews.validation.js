const Joi = require("joi");
exports.reviewValidation = (body) => {
  const schema = Joi.object({
    clientId: Joi.number().required(),
    productId: Joi.number().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().optional(),
  });

  return schema.validate(body);
};
