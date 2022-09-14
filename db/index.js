const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const Coupon = require("./models/coupon");
const OrderList = require("./models/orderList");

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Coupon = Coupon;
db.OrderList = OrderList;

Coupon.init(sequelize);
OrderList.init(sequelize);

Coupon.associate(db);
OrderList.associate(db);

module.exports = db;
