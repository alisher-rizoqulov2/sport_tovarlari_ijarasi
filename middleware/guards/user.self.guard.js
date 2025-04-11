

module.exports = function (req, res, next) {
  const id = req.params.id;
  if (id === req.user.id || req.user.is_creator === true) {
    return next();
  }
  return res.status(400).send({
    message: "faqat shaxsiy malumotlarni ko'rishga malumot etiladi",
  });
};
