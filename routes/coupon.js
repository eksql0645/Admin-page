const { Router } = require("express");
const router = Router();
const { couponService } = require("../service");

router.post("/", couponService.addCoupon);
router.get("/:couponNum", couponService.getCoupon);

module.exports = router;
