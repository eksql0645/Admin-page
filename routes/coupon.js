const { Router } = require("express");
const router = Router();
const { couponService } = require("../service");
const {
  addCouponValidator,
  getAndDeleteCouponValidator,
  getCouponListValidator,
  setCouponValidator,
} = require("../middlewares/validator/couponValidator");

router.post("/", addCouponValidator(), couponService.addCoupon);
router.get("/stats", couponService.getCouponStats);
router.get(
  "/:couponNum",
  getAndDeleteCouponValidator(),
  couponService.getCoupon
);
router.get("/", getCouponListValidator(), couponService.getCouponList);
router.patch("/:couponNum", setCouponValidator(), couponService.setCoupon);
router.delete(
  "/:couponNum",
  getAndDeleteCouponValidator(),
  couponService.deleteCoupon
);

/**
 * @swagger
 * paths:
 *   /api/coupons:
 *    post:
 *      summary:  "쿠폰 생성"
 *      description: "기간과 타입을 설정하여 쿠폰을 생성합니다."
 *      tags: [Admin Page - Coupon]
 *      parameters :
 *         - in : body
 *           name : data
 *           required : true
 *           description : 생성할 데이터
 *           schema :
 *              type : object
 *              example :
 *                {type, discount, monthPeriod, description}
 *      responses:
 *        "201":
 *          description: "생성된 쿠폰 객체를 반환합니다."
 *          content:
 *            application/json:
 *              schema:
 *                  type : object
 *                  example:
 *                          {
 *                              "id": 39,
 *                              "discount": 5,
 *                              "type": "정률",
 *                              "state": "발급완료",
 *                              "start_date": "20220914",
 *                              "end_date": "20220914",
 *                               "coupon_num": "05a7afc3f007",
 *                              "description": "배송비 무료 쿠폰"
 *                          }
 *        "400":
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                example :
 *                  {
 *                    error: [
 *                        {
 *                           message: error.message,
 *                           field: error.name
 *                        }
 *                     ]
 *                  }
 *
 */

/**
 * @swagger
 * paths:
 *   /api/coupons/{couponNum}:
 *    get:
 *      summary:  "쿠폰 조회"
 *      description: "쿠폰 번호를 사용해 해당 쿠폰을 조회합니다."
 *      tags: [Admin Page - Coupon]
 *      parameters :
 *         - in : path
 *           name : couponNum
 *           required : true
 *           description : 쿠폰번호
 *           schema :
 *              type : String
 *      responses:
 *        "200":
 *          description: "쿠폰 번호에 해당하는 쿠폰 객체를 반환합니다."
 *          content:
 *            application/json:
 *              schema:
 *                  type : object
 *                  example:
 *                          {
 *                              "id": 39,
 *                              "discount": 5,
 *                              "type": "정률",
 *                              "state": "발급완료",
 *                              "start_date": "20220914",
 *                              "end_date": "20220914",
 *                               "coupon_num": "05a7afc3f007",
 *                              "description": "배송비 무료 쿠폰"
 *                          }
 *        "400":
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                example :
 *                  {
 *                    error: [
 *                        {
 *                           message: error.message,
 *                           field: error.name
 *                        }
 *                     ]
 *                  }
 *
 */

/**
 * @swagger
 * paths:
 *   /api/coupons/?state
 *    get:
 *      summary:  "쿠폰 전체 조회"
 *      description: "쿠폰의 상태별로 필터가 가능하고 페이지네이션을 제공합니다."
 *      tags: [Admin Page - Coupon]
 *      parameters :
 *         - in : path
 *           name : page
 *           required : true
 *           description : 페이지 번호
 *           schema :
 *              type : String
 *         - in : path
 *           name : state
 *           required : false
 *           description : 쿠폰상태
 *           schema :
 *              type : String
 *      responses:
 *        "200":
 *          description: "조건에 해당하는 쿠폰 객체들을 반환합니다."
 *          content:
 *            application/json:
 *              schema:
 *                  type : object
 *                  example:
 *                        [
 *                          {
 *                              "id": 39,
 *                              "discount": 5,
 *                              "type": "정률",
 *                              "state": "발급완료",
 *                              "start_date": "20220914",
 *                              "end_date": "20220914",
 *                               "coupon_num": "05a7afc3f007",
 *                              "description": "배송비 무료 쿠폰"
 *                          },
 *                          {
 *                              "id": 39,
 *                              "discount": 5,
 *                              "type": "정률",
 *                              "state": "발급완료",
 *                              "start_date": "20220914",
 *                              "end_date": "20220914",
 *                               "coupon_num": "05a7afc3f007",
 *                              "description": "배송비 무료 쿠폰"
 *                          }
 *                        ]
 *        "400":
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                example :
 *                  {
 *                    error: [
 *                        {
 *                           message: error.message,
 *                           field: error.name
 *                        }
 *                     ]
 *                  }
 *
 */

/**
 * @swagger
 * paths:
 *   /api/coupons/{couponNum}:
 *    patch:
 *      summary:  "쿠폰 수정"
 *      description: "쿠폰 번호에 해당하는 쿠폰의 데이터를 수정합니다."
 *      tags: [Admin Page - Coupon]
 *      parameters :
 *         - in : path
 *           name : couponNum
 *           required : true
 *           description : 쿠폰번호
 *           schema :
 *              type : String
 *         - in : body
 *           name : data
 *           required : false
 *           description : 수정할 데이터
 *           schema :
 *              type : object
 *              example :
 *                {state, discount, monthPeriod, description}
 *      responses:
 *        "200":
 *          description: "수정된 쿠폰 객체를 반환합니다."
 *          content:
 *            application/json:
 *              schema:
 *                  type : object
 *                  example:
 *                          {
 *                              "id": 39,
 *                              "discount": 5,
 *                              "type": "정률",
 *                              "state": "발급완료",
 *                              "start_date": "20220914",
 *                              "end_date": "20220914",
 *                               "coupon_num": "05a7afc3f007",
 *                              "description": "배송비 무료 쿠폰"
 *                          }
 *        "400":
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                example :
 *                  {
 *                    error: [
 *                        {
 *                           message: error.message,
 *                           field: error.name
 *                        }
 *                     ]
 *                  }
 *
 */

/**
 * @swagger
 * paths:
 *   /api/coupons/{couponNum}:
 *    delete:
 *      summary:  "쿠폰 삭제"
 *      description: "쿠폰 번호에 해당하는 쿠폰을 삭제합니다."
 *      tags: [Admin Page - Coupon]
 *      parameters :
 *         - in : path
 *           name : couponNum
 *           required : true
 *           description : 쿠폰번호
 *           schema :
 *              type : String
 *      responses:
 *        "200":
 *          description: "쿠폰 삭제 메세지를 반환합니다."
 *          content:
 *            application/json:
 *              schema:
 *                  type : object
 *                  example:
 *                          {
 *                              "message": "쿠폰이 삭제되었습니다."
 *                          }
 *        "400":
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                example :
 *                  {
 *                    error: [
 *                        {
 *                           message: error.message,
 *                           field: error.name
 *                        }
 *                     ]
 *                  }
 *
 */

module.exports = router;
