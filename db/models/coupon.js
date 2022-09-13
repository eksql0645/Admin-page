const Sequelize = require("sequelize");

module.exports = class Coupon extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        type: {
          type: Sequelize.ENUM("배송비", "정액", "정률"),
          allowNull: false,
        },
        coupon_num: {
          type: Sequelize.STRING(45),
          allowNull: true,
          unique: true,
        },
        state: {
          type: Sequelize.STRING(45),
          defaultValue: "발급 완료",
          allowNull: false,
        },
        discount: {
          type: Sequelize.STRING(45),
          defaultValue: null,
          allowNull: true,
        },
        description: {
          type: Sequelize.STRING(45),
          allowNull: false,
        },
        start_date: {
          type: Sequelize.STRING(45),
          allowNull: false,
        },
        end_date: {
          type: Sequelize.STRING(45),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Coupon",
        tableName: "coupons",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Coupon.belongsTo(db.User, { foreignKey: "user", targetKey: "id" });
    db.Coupon.belongsTo(db.OrderList, {
      foreignKey: "order",
      targetKey: "id",
    });
  }
};
