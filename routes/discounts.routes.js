const { createDiscount, getDiscountById, updateDiscount, deleteDiscount, getAllDiscounts } = require("../controllers/discounts..controller");
const userActiveGuard = require("../middleware/guards/user.active.guard");
const authGuard = require("../middleware/guards/user.guard");

const router = require("express").Router();

router.post("/",authGuard, userActiveGuard, createDiscount);
router.get("/",authGuard, userActiveGuard, getAllDiscounts);
router.get("/:id",authGuard, userActiveGuard, getDiscountById);
router.put("/:id",authGuard, userActiveGuard, updateDiscount);
router.delete("/:id",authGuard, userActiveGuard, deleteDiscount);

module.exports = router;
