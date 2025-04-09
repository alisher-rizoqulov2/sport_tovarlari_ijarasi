const { createStatus, getAllStatuses, getStatusById, updateStatus, deleteStatus } = require("../controllers/status.controller");
const userActiveGuard = require("../middleware/guards/user.active.guard");
const authGuard = require("../middleware/guards/user.guard");

const router = require("express").Router();

router.post("/",authGuard, userActiveGuard, createStatus);
router.get("/",authGuard, userActiveGuard, getAllStatuses);
router.get("/:id",authGuard, userActiveGuard, getStatusById);
router.put("/:id",authGuard, userActiveGuard, updateStatus);
router.delete("/:id",authGuard, userActiveGuard, deleteStatus);

module.exports = router;
