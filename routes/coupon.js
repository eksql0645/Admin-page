const { Router } = require("express");
const router = Router();
const { couponService } = require("../service");
const {
  addCouponValidator,
  getAndDeleteCouponValidator,
  getCouponListValidator,
  setCouponValidator,
} = require("../middlewares/validator/couponValidator");

router.post("/", addCouponValidator(), couponService.addCoupon);
router.get("/stats", couponService.getCouponStats);
router.get(
  "/:couponNum",
  getAndDeleteCouponValidator(),
  couponService.getCoupon
);
router.get("/", getCouponListValidator(), couponService.getCouponList);
router.patch("/:couponNum", setCouponValidator(), couponService.setCoupon);
router.delete(
  "/:couponNum",
  getAndDeleteCouponValidator(),
  couponService.deleteCoupon
);

module.exports = router;
