const Reviews = require("../models/Reviews.model");
const { errorHandler } = require("../helpers/error_handler");
const { reviewValidation } = require("../validation/reviews.validation");
const Clients = require("../models/clients.model");
const Products = require("../models/Products.model");

const createReview = async (req, res) => {
  try {
    const { error, value } = reviewValidation(req.body);
    if (error) {
      errorHandler(error, res);
    }
    const { clientId, productId, rating, comment } = value;
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating 1 dan 5 gacha bo'lgan son bo'lishi kerak",
      });
    }
    const review = await Reviews.create({
      clientId,
      productId,
      rating,
      comment,
    });
    res.status(201).json({
      success: true,
      message: "Sharh muvaffaqiyatli yaratildi",
      review,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Reviews.findAll({ include: [Clients, Products] });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await Reviews.findByPk(req.params.id, {
      include: [Clients, Products],
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Sharh topilmadi",
      });
    }

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateReview = async (req, res) => {
  try {
    const { error, value } = reviewValidation(req.body);
    if (error) {
      errorHandler(error, res);
    }
    const { clientId, productId, rating, comment } = value;
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating 1 dan 5 gacha bo'lgan son bo'lishi kerak",
      });
    }

    const [updated] = await Reviews.update(
      { clientId, productId, rating, comment },
      {
        where: { id: req.params.id },
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Sharh topilmadi yoki yangilanmadi",
      });
    }

    const updatedReview = await Reviews.findByPk(req.params.id);

    res.status(200).json({
      success: true,
      message: "Sharh muvaffaqiyatli yangilandi",
      review: updatedReview,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteReview = async (req, res) => {
  try {
    const deleted = await Reviews.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Sharh topilmadi",
      });
    }
    res.status(200).json({
      success: true,
      message: "Sharh muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
