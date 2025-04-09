const Joi = require("joi");
exports.clientValidation = (body) => {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    birth_date: Joi.date(),
    phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    email: Joi.string().email().required(),
    passport_number: Joi.string().required(),
    password_hash: Joi.string().required(),
    address: Joi.string(),
    photo: Joi.string().uri(),
    refresh_token: Joi.string(),
    is_creator: Joi.boolean().default(true),
    is_active: Joi.boolean().default(false),
    activation_link: Joi.string(),
  });

  return schema.validate(body);
};
