const { orderModel } = require("../models");
const errorCodes = require("../utils/errorCodes");

const addOrder = async (req, res, next) => {
  try {
    const { quantity, price, buyrCity, buyrCountry, buyrZipx, vccode, user } =
      req.body;

    const orderInfo = {
      quantity,
      price,
      buyrCity,
      buyrCountry,
      buyrZipx,
      vccode,
      user,
      orderNum: Math.floor(Date.now() + Math.random()),
      date: new Date().toISOString().substring(0, 10).replace(/-/g, ""),
    };

    const order = await orderModel.createOrder(orderInfo);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const { orderNum } = req.params;
    const order = await orderModel.findOrder(orderNum);
    if (!order) {
      res.status(200).json({ message: errorCodes.thereIsNotOrder });
    }
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

const setOrder = async (req, res, next) => {
  try {
    const { orderNum } = req.params;
    const { orderState, quantity, buyrCity, buyrZipx, vccode, user } = req.body;

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
      user,
    };

    // 수정
    const result = await orderModel.updateOrder(orderNum, updateInfo);

    // 수정 결과가 없으면 서버에러
    if (!result) {
      throw new Error(errorCodes.serverError);
    }

    // 수정사항이 없으면 400에러
    if (result[0] === 0) {
      throw new Error(errorCodes.notUpdate);
    }

    order = await orderModel.findOrder(orderNum);

    // 수정 후 state에 따라 송장번호, 도시 추가 / 제거
    if (order.order_state === "배송중" || order.order_state === "배송완료") {
      order.delivery_num = Math.floor(Date.now() + Math.random());
      updateInfo = { delivery_num: order.delivery_num };
      await orderModel.updateOrder(orderNum, updateInfo);
    } else if (order.order_state === "결제취소") {
      order.delivery_num = "";
      order.buyr_city = "";
      updateInfo = {
        delivery_num: order.delivery_num,
        buyr_city: order.buyr_city,
      };
      await orderModel.updateOrder(orderNum, updateInfo);
    }

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

module.exports = { addOrder, getOrder, setOrder };
