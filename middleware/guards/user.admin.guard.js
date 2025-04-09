// middleware/checkIsCreator.js
const ApiError = require("../../helpers/api.error");

module.exports = function (req, res, next) {
  if (!req.user?.is_creator) {
    // throw ApiError.forbidden("Ruxsat berilmagan foydalanuvchi");
        return res
          .status(400)
          .send({ message: "ruhstat berilmgan foydalnuvchi" });

  }
  next();
};
