const Joi = require("joi");
exports.contractValidation = (body) => {
  const schema = Joi.object({
    clientId: Joi.number().required(),
    productId: Joi.number().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().greater(Joi.ref("start_date")).required(),
    statusId: Joi.number().required(),
    total_price: Joi.number().required(),
  });

  return schema.validate(body);
};
