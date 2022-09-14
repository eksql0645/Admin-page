const Sequelize = require("sequelize");

module.exports = class OrderList extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        order_num: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        date: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        order_state: {
          type: Sequelize.STRING(20),
          defaultValue: "결제완료",
          allowNull: false,
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        price: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        buyr_city: {
          type: Sequelize.STRING(40),
          allowNull: true,
        },
        buyr_country: {
          type: Sequelize.STRING(45),
          allowNull: false,
        },
        buyr_zipx: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        vccode: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        delivery_num: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "OrderList",
        tableName: "order_lists",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.OrderList.hasMany(db.Coupon, {
      foreignKey: "order",
      sourceKey: "id",
    });
  }
};
