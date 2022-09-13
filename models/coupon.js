const { Coupon, sequelize } = require("../db");

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

const findCouponList = async (query) => {
  const coupon = await Coupon.findAll(query);
  return coupon;
};

const findCouponStats = async () => {
  const coupon = await Coupon.findAll({
    attributes: [
      "type",
      [sequelize.fn("COUNT", sequelize.col("type")), "typeCount"],
      [sequelize.fn("SUM", sequelize.col("discount")), "totalDiscount"],
    ],
    group: "type",
    where: { state: "사용완료" },
  });
  return coupon;
};

module.exports = {
  createCoupon,
  findCoupon,
  findCouponList,
  findCouponStats,
};
