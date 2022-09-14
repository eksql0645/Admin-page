const errorCodes = require("./errorCodes");
const { exchangeAPI } = require("./exchange");

const setFlatCoupon = async (couponInfo) => {
  try {
    let { price, discount, buyrCountry } = couponInfo;

    const discountKRW = discount;
    if (buyrCountry !== "KR") {
      // discount 달러화
      discount = await exchangeAPI(Number(discount));
      discount = Number(discount.toFixed(2));
    }

    price -= discount;

    // 음수가 나오지 않게 절댓값처리
    price = Math.abs(price);

    const result = { price, discount: discountKRW };

    return result;
  } catch (err) {
    throw new Error(errorCodes.canNotApplyCoupon);
  }
};

const setFixedRateCoupon = (couponInfo) => {
  try {
    let { price, discount } = couponInfo;

    // price * discount%
    discount = (price / 100) * Number(discount);
    discount = Number(discount.toFixed(2));

    price -= discount;
    // 음수가 나오지 않게 절댓값처리
    price = Math.abs(price);

    const result = { price, discount };
    return result;
  } catch (err) {
    throw new Error(errorCodes.canNotApplyCoupon);
  }
};

module.exports = {
  setFlatCoupon,
  setFixedRateCoupon,
};
