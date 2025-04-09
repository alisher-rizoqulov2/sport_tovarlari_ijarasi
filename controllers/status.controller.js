const Status = require("../models/Status.model");
const { errorHandler } = require("../helpers/error_handler");
const { reviewValidation } = require("../validation/reviews.validation");
const { statusValidation } = require("../validation/status.validation");

const createStatus = async (req, res) => {
  try {
    const {error,value}=statusValidation(req.body)
    if(error){
        errorHandler(error,res)
    }
    const { name } = value;
    const existingStatus = await Status.findOne({ where: { name } });
    if (existingStatus) {
      return res.status(400).json({
        success: false,
        message: "Bu status allaqachon mavjud",
      });
    }
    const status = await Status.create({ name });
    res.status(201).json({
      success: true,
      message: "Status muvaffaqiyatli yaratildi",
      status,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllStatuses = async (req, res) => {
  try {
    const statuses = await Status.findAll();

    res.status(200).json({
      success: true,
      count: statuses.length,
      statuses,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getStatusById = async (req, res) => {
  try {
    const status = await Status.findByPk(req.params.id);

    if (!status) {
      return res.status(404).json({
        success: false,
        message: "Status topilmadi",
      });
    }

    res.status(200).json({
      success: true,
      status,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { error, value } = statusValidation(req.body);
    if (error) {
      errorHandler(error, res);
    }
    const { name } = value;
    const [updated] = await Status.update(
      { name },
      { where: { id: req.params.id } }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Status topilmadi yoki yangilanmadi",
      });
    }

    const updatedStatus = await Status.findByPk(req.params.id);

    res.status(200).json({
      success: true,
      message: "Status muvaffaqiyatli yangilandi",
      status: updatedStatus,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteStatus = async (req, res) => {
  try {
    const deleted = await Status.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Status topilmadi",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  createStatus,
  getAllStatuses,
  getStatusById,
  updateStatus,
  deleteStatus,
};
