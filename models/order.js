const { OrderList } = require("../db");

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

const updateOrder = async (orderNum, updateInfo) => {
  const order = await OrderList.update(updateInfo, {
    where: { order_num: orderNum },
  });
  return order;
};

module.exports = { createOrder, findOrder, updateOrder };
