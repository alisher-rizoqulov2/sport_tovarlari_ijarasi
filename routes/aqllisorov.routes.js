

const { getTopOwnersCategory, getClientPayments, getRentedProductsByDate, getDamagedProductsClients, getCancelledContractsClients } = require("../controllers/aqllisorovlar.controller");
const userGuard = require("../middleware/guards/user.guard");

const router = require("express").Router();

router.get("/:id",userGuard, getTopOwnersCategory);
router.post("/", userGuard,getClientPayments);
router.post("/:n1", userGuard,getRentedProductsByDate);
router.post("/:n2", userGuard,getDamagedProductsClients);
router.post("/:n3", userGuard,getCancelledContractsClients);

module.exports = router;
