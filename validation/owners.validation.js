const Joi = require("joi");

exports.ownerValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    email: Joi.string().email().required(),
    password_hash: Joi.string().min(6).required(),
    refresh_token: Joi.string(),
    is_creator: Joi.boolean().default(true),
    is_active: Joi.boolean().default(true),
    activation_link: Joi.string(),
  });

  return schema.validate(body);
};
