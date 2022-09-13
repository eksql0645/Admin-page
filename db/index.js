const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const Coupon = require("./models/coupon");
const OrderList = require("./models/orderList");
const User = require("./models/user");

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
db.User = User;

Coupon.init(sequelize);
User.init(sequelize);
OrderList.init(sequelize);

Coupon.associate(db);
User.associate(db);
OrderList.associate(db);

module.exports = db;
