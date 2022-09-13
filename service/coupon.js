const { couponModel } = require("../models");
const moment = require("moment");
const crypto = require("crypto");
const errorCodes = require("../utils/errorCodes");

const addCoupon = async (req, res, next) => {
  try {
    const { type, discount, monthPeriod, description } = req.body;
    const startDate = moment();
    const endDate = startDate.clone().add(monthPeriod, "months");

    // type은 배송비, 정액, 정률만 가능
    const couponInfo = {
      type,
      state: "발급완료",
      discount,
      startDate: startDate.format("YYYYMMDD"),
      endDate: endDate.format("YYYYMMDD"),
      couponNum: crypto.randomBytes(6).toString("hex"),
      description,
    };

    const coupon = await couponModel.createCoupon(couponInfo);

    res.status(201).json(coupon);
  } catch (err) {
    next(err);
  }
};

const getCoupon = async (req, res, next) => {
  try {
    const { couponNum } = req.params;

    const coupon = await couponModel.findCoupon(couponNum);
    if (!coupon) {
      res.status(200).json({ message: errorCodes.thereIsNotCoupon });
    }

    res.status(200).json(coupon);
  } catch (err) {
    next(err);
  }
};
module.exports = { addCoupon, getCoupon };
