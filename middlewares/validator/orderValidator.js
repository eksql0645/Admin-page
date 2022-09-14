const { body, query, param } = require("express-validator");
const index = require("./index");
const errorCodes = require("../../utils/errorCodes");

/**
 * <addOrder 검증 로직>
 *
 * 
 * quantity: required, int
 * buyrCity: required, max(40)
 * buyrCountry: required, max(45) 
 * buyrZipx: required, max(20)
 * vccode: required, max(20)
 * couponNum: optional, min: 12, max: 15
 * price: required, int
 * 

 */
function addOrderValidator() {
  return [
    body("quantity")
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .isInt()
      .withMessage(errorCodes.onlyUseInt),
    body("price")
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .isInt()
      .withMessage(errorCodes.onlyUseInt),
    body("buyrCity")
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .trim()
      .isLength({ max: 40 })
      .withMessage(errorCodes.tooLongString),
    body("buyrCountry")
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .trim()
      .isLength({ max: 45 })
      .withMessage(errorCodes.tooLongString),
    body("buyrZipx")
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .trim()
      .isLength({ max: 20 })
      .withMessage(errorCodes.tooLongString),
    body("vccode")
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .trim()
      .isLength({ max: 20 })
      .withMessage(errorCodes.tooLongString),
    body("couponNum")
      .optional()
      .isLength({ min: 12, max: 15 })
      .withMessage(errorCodes.tooLongString),
    index,
  ];
}
/**
 * <getOrder, deleteOrder 검증 로직>
 *
 * orderNum: required, int 

 */
function getAndDeleteOrderValidator() {
  return [
    param("orderNum")
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .isInt()
      .withMessage(errorCodes.onlyUseInt),
    index,
  ];
}

/**
 * <getOrderList 검증 로직>
 *
 * page: required, 
 * startDate: optional, min: 8, max: 8
 * endDate: optional, min: 8, max: 8
 * userName: optional, max: 10
 * orderState: optional, "결제완료", "결제취소", "배송중", "배송완료"

 */
function getOrderListValidator() {
  return [
    query("page")
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .isInt()
      .withMessage(errorCodes.onlyUseInt),
    query("startDate")
      .optional()
      .isInt()
      .withMessage(errorCodes.onlyUseInt)
      .isLength({ min: 8, max: 8 })
      .withMessage(errorCodes.dateFormat),
    query("endDate")
      .optional()
      .isInt()
      .withMessage(errorCodes.onlyUseInt)
      .isLength({ min: 8, max: 8 })
      .withMessage(errorCodes.dateFormat),
    query("userName")
      .optional()
      .isLength({ max: 10 })
      .withMessage(errorCodes.tooLongString),
    query("orderState")
      .optional()
      .isIn(["결제완료", "결제취소", "배송중", "배송완료"])
      .withMessage(errorCodes.orderStateFormat),
    index,
  ];
}

/**
 * <setOrder 검증 로직>
 *
 * orderNum: required, int
 * quantity: optional, int
 * buyrCity: optional, max(40)
 * buyrZipx: optional, max(20)
 * vccode: optional, max(20)
 * userName: optional, max(10)
 * orderState: optional, "결제완료", "결제취소", "배송중", "배송완료"
 *
 */

function setOrderValidator() {
  return [
    param("orderNum")
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .isInt()
      .withMessage(errorCodes.onlyUseInt),
    body("quantity").optional().isInt().withMessage(errorCodes.onlyUseInt),
    body("buyrCity")
      .optional()
      .isLength({ max: 40 })
      .withMessage(errorCodes.tooLongString),
    body("buyrZipx")
      .optional()
      .isLength({ max: 20 })
      .withMessage(errorCodes.tooLongString),
    body("vccode")
      .optional()
      .isLength({ max: 20 })
      .withMessage(errorCodes.tooLongString),
    body("userName")
      .optional()
      .isLength({ max: 10 })
      .withMessage(errorCodes.tooLongString),
    body("orderState")
      .optional()
      .isIn(["결제완료", "결제취소", "배송중", "배송완료"])
      .withMessage(errorCodes.orderStateFormat),
    index,
  ];
}
module.exports = {
  addOrderValidator,
  getAndDeleteOrderValidator,
  getOrderListValidator,
  setOrderValidator,
};
