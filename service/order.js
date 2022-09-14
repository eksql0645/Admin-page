const { orderModel, couponModel } = require("../models");
const errorCodes = require("../utils/errorCodes");
const { getDeliveryCost, getCountry } = require("../utils/xlsx.js");
const {
  setFlatCoupon,
  setFixedRateCoupon,
} = require("../utils/priceCalculator");
const { exchangeAPI } = require("../utils/exchange");
const moment = require("moment");
const canUseCoupon = require("../utils/canUseCoupon");
const getWhereClause = require("../utils/getWhereClause");

// 주문 생성
const addOrder = async (req, res, next) => {
  try {
    const {
      quantity,
      buyrCity,
      buyrCountry,
      buyrZipx,
      vccode,
      couponNum,
      userName,
    } = req.body;
    let { price } = req.body;

    // buyrCountry를 통해 국가명 가져오기
    const country = getCountry(buyrCountry);

    // 국가에 따른 배송비 가져오기
    let deliveryCost = getDeliveryCost(quantity, country);

    // KR이 아니라면 배송비를 달러로 환전
    if (buyrCountry !== "KR") {
      deliveryCost = await exchangeAPI(deliveryCost);
      deliveryCost = Number(deliveryCost.toFixed(2));
    }

    // 부동소수점 방지로 toFixed 사용
    price += deliveryCost;
    price = Number(price.toFixed(2));

    let result = {};

    // 쿠폰이 있다면 price = price + 배송비 - 쿠폰가
    if (couponNum) {
      // 쿠폰 존재, 기간, 상태 확인
      const coupon = await canUseCoupon(couponNum);

      const couponInfo = {
        price,
        discount: coupon.discount,
        buyrCountry,
      };

      // 쿠폰 타입별로 price 계산
      if (coupon.type === "배송비") {
        result.price = price - deliveryCost;
        result.discount = getDeliveryCost(quantity, country);
      } else if (coupon.type === "정액") {
        result = await setFlatCoupon(couponInfo);
      } else if (coupon.type === "정률") {
        result = setFixedRateCoupon(couponInfo);
      }
    }

    // 주문 생성
    const orderInfo = {
      quantity,
      price: result === {} ? result.price : price,
      buyrCity,
      buyrCountry,
      buyrZipx,
      vccode,
      orderNum: Math.floor(moment() + Math.random()),
      date: moment().format("YYYYMMDD"),
      userName,
    };

    const order = await orderModel.createOrder(orderInfo);

    if (couponNum) {
      //  쿠폰 데이터 수정
      await couponModel.updateCoupon(couponNum, {
        state: "사용완료",
        discount: result.discount,
        order: order.id,
      });
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// 주문 조회
const getOrder = async (req, res, next) => {
  try {
    const { orderNum } = req.params;

    const order = await orderModel.findOrder(orderNum);

    if (!order) {
      throw new Error({ message: errorCodes.thereIsNotOrder });
    }
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

// 주문 전체조회 (필터, 검색, 페이지네이션)
const getOrderList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page);

    // 조건에 따라 where절 가져오기
    const whereClause = getWhereClause(req.query);

    let offset = 0;

    if (page > 1) {
      offset = 30 * (page - 1);
    }

    const orderList = await orderModel.findOrderList(offset, whereClause);

    if (orderList.length === 0) {
      res.status(200).json({ message: errorCodes.thereIsNotOrder });
      return;
    }

    res.status(200).json(orderList);
  } catch (err) {
    next(err);
  }
};

// 주문 수정
const setOrder = async (req, res, next) => {
  try {
    const { orderNum } = req.params;
    const { orderState, quantity, buyrCity, buyrZipx, vccode, userName } =
      req.body;

    // 주문내역 존재 확인
    let order = await orderModel.findOrder(orderNum);
    if (!order) {
      throw new Error(errorCodes.thereIsNotOrder);
    }

    let updateInfo = {
      order_state: orderState,
      quantity,
      buyr_city: buyrCity,
      buyr_zipx: buyrZipx,
      vccode,
      user_name: userName,
      delivery_num:
        orderState === "배송중" || orderState === "배송완료"
          ? Math.floor(moment() + Math.random())
          : null,
    };

    // 수정
    const result = await orderModel.updateOrder(orderNum, updateInfo);

    // 수정 결과가 없으면 서버에러
    if (!result) {
      throw new Error(errorCodes.serverError);
    }

    // 수정사항이 없으면 400에러
    if (!result[0]) {
      throw new Error(errorCodes.notUpdate);
    }

    // 수정된 객체 조회 후 반환
    order = await orderModel.findOrder(orderNum);

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

// 주문 취소
const deleteOrder = async (req, res, next) => {
  try {
    const { orderNum } = req.params;

    // 주문내역 존재 확인
    let order = await orderModel.findOrder(orderNum);
    if (!order) {
      throw new Error(errorCodes.thereIsNotOrder);
    }

    // soft delete로 상태만 결제취소로 변경
    const deleteInfo = {
      order_state: "결제취소",
      delivery_num: null,
      buyr_city: "",
    };
    const result = await orderModel.updateOrder(orderNum, deleteInfo);

    // 수정 결과가 없으면 서버에러
    if (!result) {
      throw new Error(errorCodes.serverError);
    }

    // 상태가 수정되지 않으면 400에러
    if (result[0] === 0) {
      throw new Error(errorCodes.notUpdate);
    }

    res.status(200).json({ message: "삭제되었습니다." });
  } catch (err) {
    next(err);
  }
};

module.exports = { addOrder, getOrder, getOrderList, setOrder, deleteOrder };
