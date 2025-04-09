const sequelize = require("../config/db");
const Products = require("../models/Products.model");

// 1. Berilgan vaqt oralig’ida ijaraga berilgan mahsulotlar ro’yxati
const getRentedProductsByDate = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    const results = await sequelize.query(
      `
      SELECT 
        p.id AS productId,
        p.name AS product_name,
        c.start_date,
        c.end_date
      FROM contracts c
      JOIN products p ON c."productId" = p.id
      WHERE c.start_date >= :start_date AND c.end_date <= :end_date
      `,
      {
        replacements: { start_date, end_date },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Vaqt oralig’ida mahsulotni yaroqsiz qilgan clientlar
const getDamagedProductsClients = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    const results = await sequelize.query(
      `
      SELECT 
        cl.id AS clientId,
        cl.first_name,
        cl.last_name,
        s.name AS status_name
      FROM contracts c
      JOIN clients cl ON c."clientId" = cl.id
      JOIN status s ON c."statusId" = s.id
      WHERE s.name = 'Damaged'
        AND c.start_date >= :start_date 
        AND c.end_date <= :end_date
      `,
      {
        replacements: { start_date, end_date },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Vaqt oralig’ida buyurtmani bekor qilgan clientlar
const getCancelledContractsClients = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    const results = await sequelize.query(
      `
      SELECT 
        cl.id AS clientId,
        cl.first_name,
        cl.last_name,
        s.name AS status
      FROM contracts c
      JOIN clients cl ON c."clientId" = cl.id
      JOIN status s ON c."statusId" = s.id
      WHERE s.name = 'Cancelled'
        AND c.start_date >= :start_date AND c.end_date <= :end_date
      `,
      {
        replacements: { start_date, end_date },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Kategoriyadagi mahsulotlarni eng ko’p ijaraga bergan ownerlar
const getTopOwnersCategory = async (req, res) => {
  try {
    const categoryid= req.params.id;

    const results = await sequelize.query(
      `
      SELECT 
        o.id AS ownerId,
        o.name AS owner_name,
        COUNT(*) AS rental_count
      FROM contracts c
      JOIN products p ON c."productId" = p.id
      JOIN owners o ON p."ownerId" = o.id
      WHERE p."categoryId" = :categoryid
      GROUP BY o.id, o.name
      ORDER BY rental_count DESC
      `,
      {
        replacements: { categoryid },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Client ma’lumotlariga asoslanib barcha paymentlar (kategoriya, mahsulot, owner bilan)
const getClientPayments = async (req, res) => {
  try {
    const { first_name, phone } = req.body;

    const results = await sequelize.query(
      `
      SELECT 
        cat.name AS category_name,
        p.name AS product_name,
        o.name AS owner_name,
        pay.amount,
        pay.payment_date,
        pay.payment_status
      FROM payments pay
      JOIN contracts c ON pay."contractId" = c.id
      JOIN products p ON c."productId" = p.id
      JOIN categories cat ON p."categoryId" = cat.id
      JOIN owners o ON p."ownerId" = o.id
      JOIN clients cl ON c."clientId" = cl.id
      WHERE cl.first_name = :first_name AND cl.phone = :phone
      `,
      {
        replacements: { first_name, phone },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getRentedProductsByDate,
  getDamagedProductsClients,
  getCancelledContractsClients,
  getTopOwnersCategory,
  getClientPayments,
};
