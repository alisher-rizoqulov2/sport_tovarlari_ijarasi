const Joi = require("joi");

exports.adminValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    email: Joi.string().email().required(),
    is_creator: Joi.boolean().default(false),
    password: Joi.string().min(6).required(),
    refresh_token: Joi.string(),
    is_active: Joi.boolean().default(true),
  });

  return schema.validate(body,{abortEarly:false});
};
