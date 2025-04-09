const Clients = require("../models/clients.model");
const { errorHandler } = require("../helpers/error_handler");
const bcrypt = require("bcrypt");
const jwtService = require("../services/jwt.service");
const config = require("config");
const { clientValidation } = require("../validation/clients.validation");
const uuid = require("uuid");
const mailService = require("../services/mail.service");

const addNewClients = async (req, res) => {
  try {
    const { error, value } = clientValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }
    const activation_link = uuid.v4();

    const {
      first_name,
      last_name,
      birth_date,
      is_creator,
      phone,
      email,
      passport_number,
      password_hash,
      address,
      photo,
      refresh_token,
      is_active,
    } = value;
    const hashedPassword = bcrypt.hashSync(password_hash, 7);
    const newClients = await Clients.create({
      first_name,
      last_name,
      birth_date,
      is_creator,
      phone,
      email,
      passport_number,
      password_hash: hashedPassword,
      address,
      photo,
      activation_link,
      refresh_token,
      is_active,
      activation_link,
    });

    await mailService.sendActivationMail(
      newClients.email,
      `${config.get("api_url")}/api/clients/activate/${activation_link}`
    );
    res.status(201).send({
      message:
        "Yangi User qo'shildi. Akkuntini Faolashtirish uchun pochtaga oting",
      newClients,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
const getAllClients = async (req, res) => {
  try {
    const clients = await Clients.findAll();
    if (clients.length === 0) {
      return res.status(404).send({ message: "Clients not found" });
    }
    res.status(200).send({ message: "All clients", clients });
  } catch (error) {
    errorHandler(error, res);
  }
};
const getClientById = async (req, res) => {
  try {
    const client = await Clients.findByPk(req.params.id);
    if (!client) {
      return res.status(404).send({ message: "Client not found with this ID" });
    }
    res.status(200).send({ message: "Client by ID", client });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateClientById = async (req, res) => {
  try {
    const { error, value } = clientValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }
    const {
      first_name,
      last_name,
      birth_date,
      is_creator,
      phone,
      email,
      passport_number,
      password_hash,
      address,
      photo,
      refresh_token,
    } = value;

    if (password_hash) {
      const hashedPassword = bcrypt.hashSync(password_hash, 7);
      value.password_hash = hashedPassword;
    }

    const [updatedCount] = await Clients.update(value, {
      where: { id: req.params.id },
    });

    if (updatedCount === 0) {
      return res
        .status(404)
        .send({ message: "Client not found or not updated" });
    }

    const updatedClient = await Clients.findByPk(req.params.id);
    res.status(200).send({ message: "Client updated", client: updatedClient });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteClientById = async (req, res) => {
  try {
    const deletedCount = await Clients.destroy({
      where: { id: req.params.id },
    });

    if (deletedCount === 0) {
      return res.status(404).send({ message: "Client not found" });
    }

    res.status(200).send({ message: "Client deleted successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = await Clients.findOne({ where: { email } });

    if (!client) {
      return res.status(400).send({ message: "email yoki parol xato!" });
    }

    const validPassword = await bcrypt.compare(password, client.password_hash);
    if (!validPassword) {
      return res.status(400).send({ message: "email yoki parol xato!" });
    }

    const payload = {
      id: client.id,
      phone: client.phone,
      email: client.email,
      is_active: client.is_active,
    };
    const token = jwtService.generateTokens(payload);

    await client.update({ refresh_token: token.refreshToken });

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.status(200).send({
      message: "Tizimga xush kelibsiz!",
      accessToken: token.accessToken,
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
const logoutClient = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({
        message: "Cookie-da refresh token topilmadi",
      });
    }

    const [updatedCount] = await Clients.update(
      { refresh_token: null },
      { where: { refresh_token: refreshToken } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({
        message: "Bunday token bilan client topilmadi",
      });
    }

    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Client muvaffaqiyatli tizimdan chiqdi",
    });
  } catch (error) {
    console.error("Chiqish xatosi:", error);
    errorHandler(error, res);
  }
};
const refreshClientToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Avval tizimga kirishingiz kerak",
      });
    }

    const decodedToken = await jwtService.verifyRefreshToken(refreshToken);
    if (!decodedToken) {
      return res.status(403).json({
        success: false,
        message: "Yaroqsiz token",
      });
    }

    const client = await Clients.findOne({
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

    const tokens = jwtService.generateTokens(payload);

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
const activateClientsAccount = async (req, res) => {
  try {
    const { link } = req.params;
    const clients = await Clients.findOne({ where: { activation_link: link } });

    if (!clients) {
      return res.status(400).send({ message: "Link notogri yoki eskirgan!" });
    }
    clients.is_active = true;
    clients.activation_link = null;
    await clients.save();
    res
      .status(200)
      .send({ message: "Akkaunt muvaffaqiyatli faollashtirildi!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Serverda xatolik yuz berdi!" });
  }
};

module.exports = {
  addNewClients,
  getAllClients,
  getClientById,
  updateClientById,
  deleteClientById,
  login,
  logoutClient,
  refreshClientToken,
  activateClientsAccount
};
