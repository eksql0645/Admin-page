const { Op } = require("sequelize");
const moment = require("moment");

const getWhereClause = (data) => {
  let { startDate, endDate, userName, orderState } = data;

  const whereClause = {};

  if (!startDate && !endDate) {
    endDate = moment().format("YYYYMMDD");
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
      user_name: {
        [Op.like]: userName,
      },
    };
  }
  return whereClause;
};
module.exports = getWhereClause;
