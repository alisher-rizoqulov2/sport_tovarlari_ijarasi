const Discounts = require("../models/Discounts.model");
const { errorHandler } = require("../helpers/error_handler");
const { Op } = require("sequelize");
const { discountValidation } = require("../validation/discounts.validation");
const Products = require("../models/Products.model");

const createDiscount = async (req, res) => {
  try {
    const {error,value}=discountValidation(req.body)
    if(error){
        errorHandler(error,res)
    }
    const {productId, discount_present, start_date, end_date } = value;
    if (!discount_present || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "Chegirma foizi, boshlanish va tugash sanalari majburiy",
      });
    }

    if (discount_present <= 0 || discount_present > 100) {
      return res.status(400).json({
        success: false,
        message: "Chegirma foizi 0 dan 100 gacha bo'lishi kerak",
      });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: "Tugash sanasi boshlanish sanasidan keyin bo'lishi kerak",
      });
    }
    const discount = await Discounts.create({
        productId,
      discount_present,
      start_date: startDate,
      end_date: endDate,
    });

    res.status(201).json({
      success: true,
      message: "Chegirma muvaffaqiyatli yaratildi",
      discount,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discounts.findAll({include:[Products]});

    res.status(200).json({
      success: true,
      count: discounts.length,
      discounts,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};


const getDiscountById = async (req, res) => {
  try {
    const discount = await Discounts.findByPk(req.params.id,{include:[Products]});

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Chegirma topilmadi",
      });
    }

    res.status(200).json({
      success: true,
      discount,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateDiscount = async (req, res) => {
  try {
     const { error, value } = discountValidation(req.body);
     if (error) {
       errorHandler(error, res);
     }
     const {productId, discount_present, start_date, end_date } = value;
    const existingDiscount = await Discounts.findByPk(req.params.id);
    if (!existingDiscount) {
      return res.status(404).json({
        success: false,
        message: "Chegirma topilmadi",
      });
    }

    if (!discount_present || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "Chegirma foizi, boshlanish va tugash sanalari majburiy",
      });
    }

    if (discount_present <= 0 || discount_present > 100) {
      return res.status(400).json({
        success: false,
        message: "Chegirma foizi 0 dan 100 gacha bo'lishi kerak",
      });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: "Tugash sanasi boshlanish sanasidan keyin bo'lishi kerak",
      });
    }

    const [updated] = await Discounts.update(value, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Chegirma topilmadi yoki yangilanmadi",
      });
    }

    const updatedDiscount = await Discounts.findByPk(req.params.id);

    res.status(200).json({
      success: true,
      message: "Chegirma muvaffaqiyatli yangilandi",
      discount: updatedDiscount,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
const deleteDiscount = async (req, res) => {
  try {
    const deleted = await Discounts.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Chegirma topilmadi",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chegirma muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
};
