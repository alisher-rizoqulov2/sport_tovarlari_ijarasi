const { createContract, getAllContracts, getContractById, updateContract, deleteContract, getAllContractsClients, getAllContractsOwner } = require("../controllers/contracts..controller");
const userActiveGuard = require("../middleware/guards/user.active.guard");
const authGuard = require("../middleware/guards/user.guard");
const authclientGuard = require("../middleware/guards/client.guard");
const authownerGuard = require("../middleware/guards/owner.guard");

const router = require("express").Router();

router.post("/",authGuard, userActiveGuard,createContract );
router.get("/",authGuard, userActiveGuard, getAllContracts);

router.get("/client",authclientGuard,userActiveGuard, getAllContractsClients);
router.get("/owner", authownerGuard, userActiveGuard, getAllContractsOwner);
router.get("/:id",authGuard,userActiveGuard, getContractById);

router.put("/:id",authGuard, userActiveGuard, updateContract);
router.delete("/:id",authGuard, userActiveGuard, deleteContract);

module.exports = router;
