const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/products..controller");
const userActiveGuard = require("../middleware/guards/user.active.guard");
const authGuard = require("../middleware/guards/user.guard");

const router = require("express").Router();

router.post("/",authGuard, userActiveGuard, createProduct);
router.get("/",authGuard, userActiveGuard, getAllProducts);
router.get("/:id",authGuard, userActiveGuard, getProductById);
router.put("/:id",authGuard, userActiveGuard, updateProduct);
router.delete("/:id",authGuard, userActiveGuard, deleteProduct);

module.exports = router;
