const { body, query, param } = require("express-validator");
const index = require("./index");
const errorCodes = require("../../utils/errorCodes");

/**
 * <addCoupon 검증 로직>
 *
 * type: required, 배송비, 정액, 정률
 * discount: optional, max(45)
 * monthPeriod: optional, int
 * description: optional, max(45) 
 * 

 */
function addCouponValidator() {
  return [
    body("type")
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .isIn(["배송비", "정액", "정률"])
      .withMessage(errorCodes.couponTypeFormat),
    body("discount")
      .optional()
      .isLength({ max: 45 })
      .withMessage(errorCodes.tooLongString),
    body("monthPeriod").optional().isInt().withMessage(errorCodes.onlyUseInt),
    body("description")
      .optional()
      .isLength({ max: 45 })
      .withMessage(errorCodes.tooLongString),
    index,
  ];
}

/**
 * <getCoupon, deleteCoupon 검증 로직>
 *
 * couponNum: required, min: 12, max: 15

 */
function getAndDeleteCouponValidator() {
  return [
    param("couponNum")
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .isLength({ min: 12, max: 15 })
      .withMessage(errorCodes.tooLongString),
    index,
  ];
}

/**
 * <getCouponList 검증 로직>
 *
 * state: optional, 발급완료, 사용완료, 사용불가, 기간만료 max(45)
 *
 */
function getCouponListValidator() {
  return [
    query("state")
      .optional()
      .isLength({ max: 45 })
      .withMessage(errorCodes.tooLongString)
      .isIn(["발급완료", "사용완료", "사용불가", "기간만료"])
      .withMessage(errorCodes.couponStateFormat),
    index,
  ];
}

/**
 * <setCoupon 검증 로직>
 *
 * couponNum: required, min: 12, max: 15
 * state: optional, 발급완료, 사용완료, 사용불가, 기간만료 max(45)
 * discount: optional, max(45)
 * monthPeriod: optional, int
 * description: optional, max(45)
 *
 */

function setCouponValidator() {
  return [
    param("couponNum")
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .isLength({ min: 12, max: 15 })
      .withMessage(errorCodes.tooLongString),
    body("state")
      .optional()
      .isLength({ max: 45 })
      .withMessage(errorCodes.tooLongString)
      .isIn(["발급완료", "사용완료", "사용불가", "기간만료"])
      .withMessage(errorCodes.couponStateFormat),
    body("discount")
      .optional()
      .isLength({ max: 45 })
      .withMessage(errorCodes.tooLongString),
    body("monthPeriod").optional().isInt().withMessage(errorCodes.onlyUseInt),
    body("description")
      .optional()
      .isLength({ max: 45 })
      .withMessage(errorCodes.tooLongString),
    index,
  ];
}
module.exports = {
  addCouponValidator,
  getAndDeleteCouponValidator,
  getCouponListValidator,
  setCouponValidator,
};
