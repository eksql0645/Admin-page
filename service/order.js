const { orderModel } = require("../models");
const errorCodes = require("../utils/errorCodes");
const { Op } = require("sequelize");

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
      return;
    }
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

const getOrderList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page);
    const { userName, startDate, endDate, orderState } = req.query;

    let whereClause = {};

    if (userName) {
      whereClause = {
        user: {
          [Op.like]: userName,
        },
      };
    } else if (startDate && endDate) {
      whereClause = {
        [Op.and]: [
          { date: { [Op.gte]: startDate } },
          { date: { [Op.lte]: endDate } },
        ],
      };
    } else if (orderState) {
      whereClause = {
        order_state: {
          [Op.like]: orderState,
        },
      };
    }

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

module.exports = {
  addOrder,
  getOrder,
  getOrderList,
};
