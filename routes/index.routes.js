const router = require("express").Router();

router.use("/clients",require("./clients.routes"))
router.use("/owners",require("./owners.routes"))
router.use("/admins",require("./admins.routes"))
router.use("/status",require("./status.routes"))
router.use("/reviews",require("./reviews.routes"))
router.use("/payments",require("./payments.routes"))
router.use("/products",require("./products.routes"))
router.use("/discounts",require("./discounts.routes"))
router.use("/contracts",require("./contracts.routes"))
router.use("/categories",require("./categories.routes"))
router.use("/aqlli-sorov",require("./aqllisorov.routes"))

module.exports = router;
