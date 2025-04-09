const { addNewClients, getAllClients, getClientById, updateClientById, deleteClientById, login, logoutClient, refreshClientToken, activateClientsAccount } = require("../controllers/clients.controller");
const authGuard = require("../middleware/guards/client.guard");
const authSelfGuard = require("../middleware/guards/user.self.guard");
const userActiveGuard = require("../middleware/guards/user.active.guard");
const userGuard = require("../middleware/guards/user.guard");
const router = require("express").Router();

router.post("/", addNewClients);
router.post("/login", login);
router.get("/", userGuard, userActiveGuard, getAllClients);
router.get("/activate/:link", activateClientsAccount);
router.get("/logout", logoutClient);
router.get("/refreshtoken", refreshClientToken);
router.get("/:id", authGuard, userActiveGuard,authSelfGuard, getClientById);
router.put("/:id", authGuard, userActiveGuard, authSelfGuard,updateClientById);
router.delete("/:id", userGuard, userActiveGuard, deleteClientById);

module.exports = router;
