const { createReview, getAllReviews, getReviewById, updateReview, deleteReview } = require("../controllers/reviews.controller");
const userActiveGuard = require("../middleware/guards/user.active.guard");
const authGuard = require("../middleware/guards/user.guard");

const router = require("express").Router();

router.post("/",authGuard, userActiveGuard, createReview);
router.get("/",authGuard, userActiveGuard, getAllReviews);
router.get("/:id",authGuard, userActiveGuard, getReviewById);
router.put("/:id",authGuard, userActiveGuard, updateReview);
router.delete("/:id",authGuard, userActiveGuard, deleteReview);

module.exports = router;
