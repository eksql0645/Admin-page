const { Coupon } = require("../db");

const createCoupon = async (couponInfo) => {
  const { type, state, discount, startDate, endDate, couponNum, description } =
    couponInfo;

  const coupon = await Coupon.create({
    type,
    state,
    discount,
    start_date: startDate,
    end_date: endDate,
    coupon_num: couponNum,
    description,
  });
  return coupon;
};

const findCoupon = async (couponNum) => {
  const coupon = await Coupon.findOne({
    where: { coupon_num: couponNum },
  });
  return coupon;
};

module.exports = { createCoupon, findCoupon };
