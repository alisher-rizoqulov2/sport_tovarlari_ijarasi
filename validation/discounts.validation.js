const Joi = require("joi");
exports.discountValidation = (body) => {
  const schema = Joi.object({
    productId: Joi.number().required(),
    discount_present: Joi.number().min(0).max(100).required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().greater(Joi.ref("start_date")).required(),
  });

  return schema.validate(body);
};
