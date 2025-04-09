const Products = require("../models/Products.model");
const { errorHandler } = require("../helpers/error_handler");
const { productValidation } = require("../validation/products.validation");
const Categories = require("../models/Categories.model");
const Owners = require("../models/Owners.model");

const createProduct = async (req, res) => {
  try {
    const { error, value } = productValidation(req.body);
    if (error) {
      errorHandler(error, res);
    }
    const {
      name,
      categoryId,
      ownerId,
      price_per_day,
      available = true,
      photo,
      price,
      description,
    } = value;

    if (!name || !price_per_day) {
      return res.status(400).json({
        success: false,
        message: "Nomi va kunlik narxi majburiy maydonlar",
      });
    }
    if (price_per_day <= 0 || (price && price <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Narx musbat son bo'lishi kerak",
      });
    }
    const product = await Products.create({
      name,
      categoryId,
      ownerId,
      price_per_day,
      available,
      photo: photo || null,
      price: price || null,
      description: description || null,
    });

    res.status(201).json({
      success: true,
      message: "Mahsulot muvaffaqiyatli yaratildi",
      product,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const where = {};
    if (req.query.available) {
      where.available = req.query.available === "true";
    }

    const products = await Products.findAll({include:[Categories,Owners]});

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Products.findByPk(req.params.id,{include:[Categories,Owners]});

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Mahsulot topilmadi",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { error, value } = productValidation(req.body);
    if (error) {
      errorHandler(error, res);
    }
    const {
      name,
      categoryId,
      ownerId,
      price_per_day,
      available = true,
      photo,
      price,
      description,
    } = value;

    if (!name || !price_per_day) {
      return res.status(400).json({
        success: false,
        message: "Nomi va kunlik narxi majburiy maydonlar",
      });
    }
    if (price_per_day <= 0 || (price && price <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Narx musbat son bo'lishi kerak",
      });
    }

    const [updated] = await Products.update(
      {
        name,
        categoryId,
        ownerId,
        price_per_day,
        available,
        photo,
        price,
        description,
      },
      {
        where: { id: req.params.id },
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Mahsulot topilmadi yoki yangilanmadi",
      });
    }

    const updatedProduct = await Products.findByPk(req.params.id);

    res.status(200).json({
      success: true,
      message: "Mahsulot muvaffaqiyatli yangilandi",
      product: updatedProduct,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await Products.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Mahsulot topilmadi",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mahsulot muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
