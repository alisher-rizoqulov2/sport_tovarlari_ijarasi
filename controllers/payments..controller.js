const Payments = require("../models/Payments.model");
const { errorHandler } = require("../helpers/error_handler");
const { paymentValidation } = require("../validation/payments.validation");
const Contracts = require("../models/Contracts.model");
const createPayment = async (req, res) => {
  try {
    const { error, value } = paymentValidation(req.body);
    const {
      contractId,
      amount,
      payment_date,
      payment_status,
      transaction_code,
      status,
    } = value;
    if (error) {
      errorHandler(error, res);
    }
    const payment = await Payments.create({
      contractId,
      amount,
      payment_date: new Date(payment_date),
      payment_status,
      transaction_code: transaction_code || null,
      status,
    });

    res.status(201).json({
      success: true,
      message: "To'lov muvaffaqiyatli yaratildi",
      payment,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payments.findAll({ include: [Contracts] });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payments.findByPk(req.params.id, {
      include: [Contracts],
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "To'lov topilmadi",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updatePayment = async (req, res) => {
  try {
    const { error, value } = paymentValidation(req.body);
    const {
      contractId,
      amount,
      payment_date,
      payment_status,
      transaction_code,
      status,
    } = value;
    if (error) {
      errorHandler(error, res);
    }
    const [updated] = await Payments.update(
      {
        contractId,
        amount,
        payment_date,
        payment_status,
        transaction_code,
        status,
      },
      {
        where: { id: req.params.id },
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "To'lov topilmadi yoki yangilanmadi",
      });
    }

    const updatedPayment = await Payments.findByPk(req.params.id);

    res.status(200).json({
      success: true,
      message: "To'lov muvaffaqiyatli yangilandi",
      payment: updatedPayment,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deletePayment = async (req, res) => {
  try {
    const deleted = await Payments.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "To'lov topilmadi",
      });
    }

    res.status(200).json({
      success: true,
      message: "To'lov muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
