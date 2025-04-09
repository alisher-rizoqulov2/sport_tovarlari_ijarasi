const { addNewOwner, loginOwner, getAllOwners, logoutOwner, getOwnerById, updateOwner, deleteOwner, refreshOwnerToken, activateOwnersAccount } = require("../controllers/owners.controller");
const authGuard = require("../middleware/guards/owner.guard");
const authSelfGuard = require("../middleware/guards/user.self.guard");
const userActiveGuard = require("../middleware/guards/user.active.guard");
const userGuard = require("../middleware/guards/user.guard");
const router = require("express").Router();

router.post("/", addNewOwner);
router.post("/login", loginOwner);
router.get("/", userGuard,getAllOwners);
router.get("/activate/:link", activateOwnersAccount);
router.get("/logout", logoutOwner);
router.get("/refreshtoken", refreshOwnerToken);
router.get("/:id",authGuard, userActiveGuard,authSelfGuard, getOwnerById);
router.put("/:id", authGuard, userActiveGuard,authSelfGuard,updateOwner);
router.delete("/:id", userGuard,deleteOwner);

module.exports = router;
