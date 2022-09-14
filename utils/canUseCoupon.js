const { couponModel } = require("../models");
const errorCodes = require("./errorCodes");
const moment = require("moment");

const canUseCoupon = async (couponNum) => {
  try {
    // 쿠폰 존재 확인
    const coupon = await couponModel.findCoupon(couponNum);
    if (!coupon) {
      throw new Error(errorCodes.thereIsNotCoupon);
    }
    // 쿠폰 사용유무 확인
    if (coupon.state === "사용완료") {
      throw new Error(errorCodes.alreadyUsedCoupon);
    }
    // 쿠폰 기간 확인
    if (coupon.end_date < moment().format("YYYYMMDD")) {
      await couponModel.updateCoupon(couponNum, { state: "기간만료" });
      throw new Error(errorCodes.expiredCoupon);
    }
    return coupon;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = canUseCoupon;
