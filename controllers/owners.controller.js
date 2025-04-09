const Owners = require("../models/Owners.model");
const { errorHandler } = require("../helpers/error_handler");
const bcrypt = require("bcrypt");
const jwtServiceowner = require("../services/jwtowner.service");
const config = require("config");
const { ownerValidation } = require("../validation/owners.validation");
const uuid = require("uuid");
const mailService = require("../services/mail.service");

const addNewOwner = async (req, res) => {
  try {
    const {error,value}=ownerValidation(req.body)
    if(error){
        errorHandler(error,res)
    }
    const { name, phone, email, password_hash, is_creator, is_active } = value;
    const activation_link = uuid.v4();
    
    const existingOwner = await Owners.findOne({ where: { email } });
    if (existingOwner) {
      return res.status(400).json({
        success: false,
        message: "Bu email allaqachon ro'yxatdan o'tgan",
      });
    }
    const hashedPassword = bcrypt.hashSync(password_hash, 7);
    const newOwner = await Owners.create({
      name,
      phone,
      email,
      is_creator,
      password_hash: hashedPassword,
      is_active,
      activation_link,
    });
    await mailService.sendActivationMail(
      newOwner.email,
      `${config.get("api_url")}/api/owners/activate/${activation_link}`
    );
            res.status(201).send({
              message:
                "Yangi User qo'shildi. Akkuntini Faolashtirish uchun pochtaga oting",
              newOwner,
            });
  } catch (error) {
    errorHandler(error, res);
  }
};
const activateOwnersAccount = async (req, res) => {
  try {
    const { link } = req.params;
    const owners = await Owners.findOne({ where: { activation_link: link } });

    if (!owners) {
      return res.status(400).send({ message: "Link notogri yoki eskirgan!" });
    }
    owners.is_active = true;
    owners.activation_link = null;
    await owners.save();
    res
      .status(200)
      .send({ message: "Akkaunt muvaffaqiyatli faollashtirildi!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Serverda xatolik yuz berdi!" });
  }
};
const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await Owners.findOne({ where: { email } });
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Email yoki parol noto'g'ri",
      });
    }
    const validPassword = bcrypt.compareSync(password, owner.password_hash);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Email yoki parol noto'g'ri",
      });
    }
    const payload = {
      id: owner.id,
      email: owner.email,
      is_creator: owner.is_creator,
      is_active:owner.is_active,
    };
    const tokens = jwtServiceowner.generateTokens(payload);
    await owner.update({ refresh_token: tokens.refreshToken });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.status(200).json({
      success: true,
      message: "Tizimga muvaffaqiyatli kirdingiz",
      accessToken: tokens.accessToken,
      owner: {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        is_creator: owner.is_creator,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
const getAllOwners = async (req, res) => {
  try {
    const owners = await Owners.findAll({
      attributes: { exclude: ["password_hash", "refresh_token"] },
    });

    res.status(200).json({
      success: true,
      count: owners.length,
      owners,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getOwnerById = async (req, res) => {
  try {
    const owner = await Owners.findByPk(req.params.id, {
      attributes: { exclude: ["password_hash", "refresh_token"] },
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi",
      });
    }

    res.status(200).json({
      success: true,
      owner,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateOwner = async (req, res) => {
  try {
    const {error,value}=ownerValidation(req.body)
    if(error){
        errorHandler(error,res)
    }
    const { name, phone, email, password_hash, is_creator } = value;
    const updateData = { name, phone, email, is_creator };

    if (password_hash) {
      updateData.password_hash = bcrypt.hashSync(password_hash, 7);
    }

    const [updated] = await Owners.update(updateData, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi",
      });
    }

    const updatedOwner = await Owners.findByPk(req.params.id, {
      attributes: { exclude: ["password_hash", "refresh_token"] },
    });

    res.status(200).json({
      success: true,
      message: "Foydalanuvchi ma'lumotlari yangilandi",
      owner: updatedOwner,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteOwner = async (req, res) => {
  try {
    const deleted = await Owners.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi",
      });
    }

    res.status(200).json({
      success: true,
      message: "Foydalanuvchi muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutOwner = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Siz avval tizimga kirmagansiz",
      });
    }

    await Owners.update(
      { refresh_token: null },
      { where: { refresh_token: refreshToken } }
    );

    res.clearCookie("refreshToken");
    res.status(200).json({
      success: true,
      message: "Muvaffaqiyatli chiqdingiz",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
const refreshOwnerToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Avval tizimga kirishingiz kerak",
      });
    }

    const decodedToken = await jwtServiceowner.verifyRefreshToken(refreshToken);
    if (!decodedToken) {
      return res.status(403).json({
        success: false,
        message: "Yaroqsiz token",
      });
    }

    const client = await Owners.findOne({
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

    const tokens = jwtServiceowner.generateTokens(payload);

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
module.exports = {
  addNewOwner,
  loginOwner,
  getAllOwners,
  getOwnerById,
  updateOwner,
  deleteOwner,
  logoutOwner,
  refreshOwnerToken,
  activateOwnersAccount
};
