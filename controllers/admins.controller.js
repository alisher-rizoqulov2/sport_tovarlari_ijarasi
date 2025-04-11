const Admins = require("..//models/Admins.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../helpers/error_handler");
const config = require("config");
const jwtServiceadmins = require("../services/jwtadmin.service");
const { adminValidation } = require("../validation/admin.validation");
const uuid = require("uuid");
const mailService = require("../services/mail.service");
const logger = require("../services/logger.service");
const ApiError = require("../helpers/api.error");

const registerAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body)
    if (error) {
      return errorHandler(error, res);
    }
    const { name, email, phone, password, is_creator, is_active } = value;
    const isExist = await Admins.findOne({ where: { email } });
    if (isExist) {
      return res
        .status(400)
        .json({ message: "Bu email allaqachon ro'yxatdan o'tgan" });
    }
    // const activation_link = uuid.v4();
    
    const existingAdmin = await Admins.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Bu email allaqachon ro'yxatdan o'tgan",
      });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const admin = await Admins.create({
      name,
      email,
      phone,
      is_creator,
      password_hash: hashedPassword,
      is_active,
    });

    //  await mailService.sendActivationMail(
    //    admin.email,
    //    `${config.get("api_url")}/api/admins/activate/${activation_link}`
    //  );
        res.status(201).send({
          message:
            "Yangi User qo'shildi",
          admin,
        });
        logger.info("Yangi admin yaratildi",admin)
  } catch (error) {
    logger.error("Error createng admin" +error.message)
    errorHandler(error, res);
  }
};
// const activateAdminsAccount = async (req, res) => {
//   try {
//     const { link } = req.params;
//     const admins = await Admins.findOne({ where: { activation_link: link } });

//     if (!admins) {
//       return res.status(400).send({ message: "Link notogri yoki eskirgan!" });
//     }
//     admins.is_active = true;
//     admins.activation_link = null;
//     await admins.save();
//     res
//       .status(200)
//       .send({ message: "Akkaunt muvaffaqiyatli faollashtirildi!" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: "Serverda xatolik yuz berdi!" });
//   }
// };
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admins.findAll({
      attributes: { exclude: ["password_hash", "refresh_token"] },
    });

    res.json({
      success: true,
      admins,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAdminById = async (req, res) => {
  try {
    const admin = await Admins.findByPk(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin topilmadi",
      });
    }

    res.json({
      success: true,
      admin,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body)
    if (error) {
      return errorHandler(error, res);
    }
    const { name, email, phone, password, is_creator } = value;
    const updateData = { name, email, phone, is_creator };
    if (password) {
      updateData.password_hash = bcrypt.hashSync(password, 10);
    }
    const [updated] = await Admins.update(updateData, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Admin topilmadi",
      });
    }
    const updatedAdmin = await Admins.findByPk(req.params.id, {
      attributes: { exclude: ["password_hash", "refresh_token"] },
    });

    res.json({
      success: true,
      message: "Admin ma'lumotlari yangilandi",
      admin: updatedAdmin,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const deleted = await Admins.destroy({
      where: { id: req.params.id },
    });
    console.log(deleted);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Admin topilmadi",
      });
    }

    res.json({
      success: true,
      message: "Admin muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Siz avval tizimga kirmagansiz",
      });
    }

    await Admins.update(
      { refresh_token: null },
      { where: { refresh_token: refreshToken } }
    );

    res.clearCookie("refreshToken");
    res.json({
      success: true,
      message: "Muvaffaqiyatli chiqdingiz",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admins.findOne({ where: { email } });
    
    if (!admin) {
      return res.status(400).send({ message: "email yoki parol xato!" });
    }

    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      return res.status(400).send({ message: "email yoki parol xato!" });
    }

    const payload = {
      id: admin.id,
      phone: admin.phone,
      email: admin.email,
      is_creator: admin.is_creator,
      is_active: admin.is_active,
    };
    const token = jwtServiceadmins.generateTokens(payload);

    await admin.update({ refresh_token: token.refreshToken });

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.status(200).send({
      message: "Tizimga xush kelibsiz!",
      accessToken: token.accessToken,
      admin: {
        id: admin.id,
        first_name: admin.first_name,
        last_name: admin.last_name,
        phone: admin.phone,
        email: admin.email,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
const refreshAdmintToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Avval tizimga kirishingiz kerak",
      });
    }

    const decodedToken = await jwtServiceadmins.verifyRefreshToken(refreshToken);
    if (!decodedToken) {
      return res.status(403).json({
        success: false,
        message: "Yaroqsiz token",
      });
    }

    const client = await Admins.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi yoki avval tizimdan chiqib bo'lingan",
      });
    }

    const payload = {
      id: client.id,
      phone: client.phone,
      email: client.email,
      role: client.is_creator,
    };

    const tokens = jwtServiceadmins.generateTokens(payload);

    await client.update({ refresh_token: tokens.refreshToken });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.status(200).json({
      success: true,
      message: "Tokenlar muvaffaqiyatli yangilandi",
      accessToken: tokens.accessToken,
      client: {
        id: client.id,
        first_name: client.first_name,
        last_name: client.last_name,
        phone: client.phone,
        email: client.email,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
const changeIsActive = async (req, res) => {
  try {
    const adminId = req.params.id;
    const { is_active } = req.body;
    const requere = req.user;

    if (requere.id == adminId) {
      throw ApiError.badRequest("O'zingizni aktiv holatni o'zgartira olmaysiz");
    }

    const targetAdmin = await Admins.findByPk(adminId);

    if (!targetAdmin) {
      throw ApiError.notFound("Admin topilmadi");
    }

    if (targetAdmin.id === 1) {
      throw ApiError.forbidden("Superadminni ozgartirish mumkin emas");
    }

    targetAdmin.is_active = is_active;
    await targetAdmin.save();

    res.json({
      message: `Admin holati ${is_active ? "aktivlashtirildi" : "bloklandi"}`,
      admin: targetAdmin,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  registerAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  logoutAdmin,
  login,
  refreshAdmintToken,
  changeIsActive
};
