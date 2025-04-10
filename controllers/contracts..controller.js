const Contracts = require("../models/Contracts.model");
const { errorHandler } = require("../helpers/error_handler");
const { contractValidation } = require("../validation/cantracts.validation");
const Clients = require("../models/clients.model");
const Products = require("../models/Products.model");
const Status = require("../models/Status.model");

const createContract = async (req, res) => {
  try {
    const { error, value } = contractValidation(req.body);
    if (error) {
      errorHandler(error, res);
    }
    const { clientId, productId, start_date, end_date, statusId,total_price } =
      value;
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: "Tugash sanasi boshlanish sanasidan keyin bo'lishi kerak",
      });
    }
    const discount = await Contracts.create({
      clientId,
      productId,
      total_price,
      start_date: startDate,
      end_date: endDate,
      statusId,
    });

    res.status(201).json({ message: "Contract created", contract: discount });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllContracts = async (req, res) => {
  try {
    const contracts = await Contracts.findAll({
      include: [Clients, Products, Status],
    });
    res.status(200).json(contracts);
  } catch (error) {
    errorHandler(error, res);
  }
};
const getAllContractsClients = async (req, res) => {
  try {
    const id=req.user.id
    const contracts = await Contracts.findAll({
      where: {
        clientId: id, 
      },
      include: [Clients, Products, Status],
    });
    res.status(200).json(contracts);
  } catch (error) {
    errorHandler(error, res);
  }
};
const getAllContractsOwner = async (req, res) => {
  try {
    const id=req.user.id
    console.log(id);
    
    const product = await Products.findAll({
      where: {
        ownerId: id, 
      }
    });
    console.log(product[0].id);
    
    const contracts = await Contracts.findAll({
      where: {
        productId: product?.[0]?.id ,
      },
      include: [Clients, Products, Status],
    });
    res.status(200).json(contracts);
  } catch (error) {
    errorHandler(error, res);
  }
};
const getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contracts.findByPk(id, {
      include: [Clients, Products,Status],
    });

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    res.status(200).json(contract);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateContract = async (req, res) => {
  try {
    const { id } = req.params;
   const { error, value } = contractValidation(req.body);
   if (error) {
     errorHandler(error, res);
   }
   const { clientId, productId,start_date, end_date,statusId, total_price } = value;

    const contract = await Contracts.findByPk(id);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    await contract.update({
      clientId,
      productId,
      start_date,
      end_date,
      statusId,
      total_price,
    });

    res.status(200).json({ message: "Contract updated", contract });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteContract = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contracts.findByPk(id);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }
    await contract.destroy();
    res.status(200).json({ message: "Contract deleted" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  createContract,
  getAllContracts,
  getAllContractsClients,
  getAllContractsOwner,
  getContractById,
  updateContract,
  deleteContract,
};
