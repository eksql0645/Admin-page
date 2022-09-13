const { OrderList } = require("../db");
const { Op } = require("sequelize");

const createOrder = async (orderInfo) => {
  const {
    quantity,
    price,
    buyrCity,
    buyrCountry,
    buyrZipx,
    vccode,
    user,
    date,
    orderNum,
  } = orderInfo;

  const order = await OrderList.create({
    quantity,
    price,
    buyr_city: buyrCity,
    buyr_country: buyrCountry,
    buyr_zipx: buyrZipx,
    vccode,
    user,
    date,
    order_num: orderNum,
  });
  return order;
};

const findOrder = async (orderNum) => {
  const order = await OrderList.findOne({ where: { order_num: orderNum } });
  return order;
};

const findOrderList = async (offset, whereClause) => {
  const orderList = await OrderList.findAll({
    limit: 30,
    offset: offset,
    where: { [Op.and]: [whereClause] },
  });

  return orderList;
};

module.exports = {
  createOrder,
  findOrder,
  findOrderList,
};
