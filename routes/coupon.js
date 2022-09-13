const { Router } = require("express");
const router = Router();
const { couponService } = require("../service");

router.post("/", couponService.addCoupon);

module.exports = router;
