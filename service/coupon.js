const { couponModel } = require("../models");
const moment = require("moment");
const crypto = require("crypto");
const errorCodes = require("../utils/errorCodes");
const { Op } = require("sequelize");
const canUseCoupon = require("../utils/canUseCoupon");

// 쿠폰 생성
const addCoupon = async (req, res, next) => {
  try {
    const { type, discount, monthPeriod, description } = req.body;

    const startDate = moment();

    // monthPeriod가 있으면 달단위로 endDate를 설정하고 없으면 당일로 설정
    const endDate = monthPeriod
      ? startDate.clone().add(monthPeriod, "months")
      : startDate;

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

// 쿠폰 조회
const getCoupon = async (req, res, next) => {
  try {
    const { couponNum } = req.params;

    const coupon = await couponModel.findCoupon(couponNum);
    if (!coupon) {
      throw new Error({ message: errorCodes.thereIsNotCoupon });
    }

    res.status(200).json(coupon);
  } catch (err) {
    next(err);
  }
};

// 쿠폰 전체 조회 (상태 필터)
const getCouponList = async (req, res, next) => {
  try {
    const { state } = req.query;
    const page = parseInt(req.query.page);

    let offset = 0;

    if (page > 1) {
      offset = 30 * (page - 1);
    }

    let whereClause = {};

    if (state) {
      whereClause = {
        state: { [Op.like]: state },
      };
    }

    const coupon = await couponModel.findCouponList(offset, whereClause);

    if (coupon.length === 0) {
      res.status(200).json({ message: errorCodes.thereIsNotCoupon });
      return;
    }

    res.status(200).json(coupon);
  } catch (err) {
    next(err);
  }
};

// 쿠폰 통계 - 사용된 쿠폰의 타입별 총할인액 / 사용횟수
const getCouponStats = async (req, res, next) => {
  try {
    const coupon = await couponModel.findCouponStats();

    res.status(200).json(coupon);
  } catch (err) {
    next(err);
  }
};

// 쿠폰 수정
const setCoupon = async (req, res, next) => {
  try {
    const { couponNum } = req.params;
    const { state, discount, monthPeriod, description } = req.body;

    let coupon = await canUseCoupon(couponNum);

    const updateInfo = {
      state,
      discount,
      end_date: moment(coupon.start_date)
        .clone()
        .add(monthPeriod, "months")
        .format("YYYYMMDD"),
      description,
    };

    const isUpdated = await couponModel.updateCoupon(couponNum, updateInfo);

    if (!isUpdated[0]) {
      throw new Error(errorCodes.notUpdate);
    }

    // 수정된 객체 반환
    coupon = await couponModel.findCoupon(couponNum);

    res.status(200).json(coupon);
  } catch (err) {
    next(err);
  }
};

// 쿠폰 삭제
const deleteCoupon = async (req, res, next) => {
  try {
    const { couponNum } = req.params;

    const coupon = await canUseCoupon(couponNum);
    if (!coupon) {
      throw new Error(errorCodes.thereIsNotCoupon);
    }

    const updateInfo = {
      state: "사용불가",
      end_date: coupon.start_date,
    };

    const isDeleted = await couponModel.updateCoupon(couponNum, updateInfo);

    if (!isDeleted[0]) {
      throw new Error(errorCodes.notDelete);
    }

    res.status(200).json({ message: "쿠폰이 사용불가 처리되었습니다." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addCoupon,
  getCoupon,
  getCouponList,
  getCouponStats,
  setCoupon,
  deleteCoupon,
};
