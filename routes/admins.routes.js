const { registerAdmin, getAllAdmins, logoutAdmin, getAdminById, updateAdmin, deleteAdmin, login, refreshAdmintToken, activateAdminsAccount, changeIsActive } = require("../controllers/admins.controller");
const authGuard = require("../middleware/guards/user.guard");
const authSelfGuard = require("../middleware/guards/user.self.guard");
const authAdminGuard = require('../middleware/guards/user.admin.guard');
const userActiveGuard = require("../middleware/guards/user.active.guard");


const router = require("express").Router();

router.post("/", registerAdmin);
router.post("/login", login);
// router.get("/activate/:link", activateAdminsAccount);
router.get("/", authGuard,authAdminGuard, getAllAdmins);
router.get("/logout", logoutAdmin);
router.patch("/activetionid/:id", authGuard, authAdminGuard,changeIsActive);
router.get("/refreshtoken", refreshAdmintToken);
router.get("/:id", authGuard, userActiveGuard,authSelfGuard, getAdminById);
router.put("/:id",authGuard,authSelfGuard, updateAdmin);
router.delete("/:id", authGuard,authAdminGuard, deleteAdmin);

module.exports = router;
