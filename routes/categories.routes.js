const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require("../controllers/categories..controller");
const userActiveGuard = require("../middleware/guards/user.active.guard");
const authGuard = require("../middleware/guards/user.guard");
const ownersguard=require("../middleware/guards/owner.guard")
const router = require("express").Router();

router.post("/", authGuard, userActiveGuard, createCategory);
router.post("/:owner",ownersguard,userActiveGuard, createCategory);
router.get("/", authGuard, userActiveGuard, getAllCategories);
router.get("/:owner", ownersguard, userActiveGuard, getAllCategories);
router.get("/:id", authGuard, userActiveGuard, getCategoryById);
router.put("/:id",  authGuard, userActiveGuard,updateCategory);
router.put("/owner/:id", ownersguard, userActiveGuard, updateCategory);
router.delete("/:id",authGuard, userActiveGuard, deleteCategory);

module.exports = router;