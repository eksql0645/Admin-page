const { Router } = require("express");
const router = Router();
const orderRouter = require("./order");
const couponRouter = require("./coupon");

router.use("/orders", orderRouter);
router.use("/coupons", couponRouter);

module.exports = router;
