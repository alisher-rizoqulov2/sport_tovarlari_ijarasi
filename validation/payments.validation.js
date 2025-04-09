const Joi = require("joi");
exports.paymentValidation = (body) => {
  const schema = Joi.object({
    contractId: Joi.number().required(),
    amount: Joi.number().required(),
    payment_date: Joi.date().required(),
    payment_status: Joi.string().required(),
    transaction_code: Joi.string().optional(),
    status: Joi.string().valid("pending", "completed", "failed").required(),
  });

  return schema.validate(body);
};
