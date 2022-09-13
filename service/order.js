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
    let { startDate, endDate, userName, orderState } = req.query;

    const whereClause = {};

    if (!startDate && !endDate) {
      endDate = new Date().toISOString().substring(0, 10).replace(/-/g, "");
    }
    if (!startDate || !endDate) {
      whereClause.date = {
        [Op.or]: [
          {
            date: { [Op.lte]: endDate },
          },
          {
            date: { [Op.gte]: startDate },
          },
        ],
      };
    } else if (startDate && endDate) {
      whereClause.date = {
        [Op.and]: [
          {
            date: { [Op.lte]: endDate },
          },
          {
            date: { [Op.gte]: startDate },
          },
        ],
      };
    }

    if (orderState) {
      whereClause.orderState = {
        order_state: {
          [Op.like]: orderState,
        },
      };
    }

    if (userName) {
      whereClause.userName = {
        user: {
          [Op.like]: userName,
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
      delivery_num:
        orderState === "배송중" || orderState === "배송완료"
          ? Math.floor(Date.now() + Math.random())
          : null,
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

    // 수정된 객체 조회 후 반환
    order = await orderModel.findOrder(orderNum);

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

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
