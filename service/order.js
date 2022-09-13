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

const getOrderList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page);
    let offset = 0;

    if (page > 1) {
      offset = 30 * (page - 1);
    }

    const orderList = await orderModel.findOrderList(offset);

    if (!orderList) {
      res.status(200).json({ message: errorCodes.thereIsNotOrder });
    }

    res.status(200).json(orderList);
  } catch (err) {
    next(err);
  }
};

module.exports = { addOrder, getOrder, getOrderList };
