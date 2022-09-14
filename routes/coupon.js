const { Router } = require("express");
const router = Router();
const { couponService } = require("../service");

router.post("/", couponService.addCoupon);
router.get("/stats", couponService.getCouponStats);
router.get("/:couponNum", couponService.getCoupon);
router.get("/", couponService.getCouponList);
router.patch("/:couponNum", couponService.setCoupon);
module.exports = router;
