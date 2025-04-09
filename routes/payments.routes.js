const { createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment } = require("../controllers/payments..controller");
const userActiveGuard = require("../middleware/guards/user.active.guard");
const authGuard = require("../middleware/guards/user.guard");

const router = require("express").Router();

router.post("/",authGuard, userActiveGuard, createPayment);
router.get("/",authGuard, userActiveGuard, getAllPayments);
router.get("/:id",authGuard, userActiveGuard, getPaymentById);
router.put("/:id",authGuard, userActiveGuard, updatePayment);
router.delete("/:id",authGuard, userActiveGuard, deletePayment);

module.exports = router;
