const ApiError = require("../../helpers/api.error");

module.exports = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user; //req.user JWT token orqali keladi
    if (!user) {
        throw ApiError.unauthorized("Token berilmagan");
    //   return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(user.role)) {
        throw ApiError.forbidden("Acces Denied");

    //   return res.status(403).json({ message: "Acces Denied" });
    }
    next();
  };
};
