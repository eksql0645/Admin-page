const { Router } = require("express");
const {
  addOrderValidator,
  getAndDeleteOrderValidator,
  getOrderListValidator,
  setOrderValidator,
} = require("../middlewares/validator/orderValidator");
const router = Router();
const { orderService } = require("../service");

router.post("/", addOrderValidator(), orderService.addOrder);
router.get("/:orderNum", getAndDeleteOrderValidator(), orderService.getOrder);
router.get("/", getOrderListValidator(), orderService.getOrderList);
router.patch("/:orderNum", setOrderValidator(), orderService.setOrder);
router.delete(
  "/:orderNum",
  getAndDeleteOrderValidator(),
  orderService.deleteOrder
);

/**
 * @swagger
 * paths:
 *   /api/orders:
 *    post:
 *      summary:  "주문 생성"
 *      description: "주문 생성 시 원-달러 환율 API를 사용해 배송비를 환전하고 쿠폰 타입에 따라 할인을 제공합니다."
 *      tags: [Admin Page - Order]
 *      parameters :
 *         - in : body
 *           name : data
 *           required : true
 *           description : 생성할 데이터
 *           schema :
 *              type : object
 *              example :
 *                {quantity, buyrCity, buyrCountry, buyrZipx, vccode, couponNum, userName, price}
 *      responses:
 *        "201":
 *          description: "주문 생성 시 쿠폰을 사용했다면 쿠폰 데이터를 수정하고 생성된 주문 객체를 반환합니다."
 *          content:
 *            application/json:
 *              schema:
 *                  type : object
 *                  example:
 *                          {
 *                              "id": 207,
 *                              "order_state": "결제완료",
 *                              "quantity": 1,
 *                              "price": 86000,
 *                              "buyr_city": "Rostock",
 *                              "buyr_country": "KR",
 *                              buyr_zipx": "11355",
 *                              "vccode": "1",
 *                              "user_name": "test2",
 *                              "date": "20220914",
 *                              "order_num": 1663157064404
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
 *   /api/orders/{orderNum}:
 *    get:
 *      summary:  "주문 조회"
 *      description: "주문 번호를 사용해 해당 주문을 조회합니다."
 *      tags: [Admin Page - Order]
 *      parameters :
 *         - in : path
 *           name : orderNum
 *           required : true
 *           description : 주문번호
 *           schema :
 *              type : String
 *      responses:
 *        "200":
 *          description: "주문 번호에 해당하는 주문 객체를 반환합니다."
 *          content:
 *            application/json:
 *              schema:
 *                  type : object
 *                  example:
 *                          {
 *                              "id": 207,
 *                              "order_state": "결제완료",
 *                              "quantity": 1,
 *                              "price": 86000,
 *                              "buyr_city": "Rostock",
 *                              "buyr_country": "KR",
 *                              buyr_zipx": "11355",
 *                              "vccode": "1",
 *                              "user_name": "test2",
 *                              "date": "20220914",
 *                              "order_num": 1663157064404
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
 *   /api/orders/?page&startDate&endDate&userName&orderState
 *    get:
 *      summary:  "주문 전체 조회"
 *      description: "기간별, 주문 상태별로 필터가 가능하고 주문자명으로 검색이 가능하며 페이지네이션을 제공합니다."
 *      tags: [Admin Page - Order]
 *      parameters :
 *         - in : path
 *           name : page
 *           required : true
 *           description : 페이지 번호
 *           schema :
 *              type : String
 *         - in : path
 *           name : startDate
 *           required : false
 *           description : 검색시작일자
 *           schema :
 *              type : String
 *         - in : path
 *           name : endDate
 *           required : false
 *           description : 검색끝일자
 *           schema :
 *              type : String
 *         - in : path
 *           name : userName
 *           required : false
 *           description : 주문자명
 *           schema :
 *              type : String
 *         - in : path
 *           name : orderState
 *           required : false
 *           description : 주문상태
 *           schema :
 *              type : String
 *      responses:
 *        "200":
 *          description: "조건에 해당하는 주문 객체들을 반환합니다."
 *          content:
 *            application/json:
 *              schema:
 *                  type : object
 *                  example:
 *                        [
 *                          {
 *                              "id": 207,
 *                              "order_state": "결제완료",
 *                              "quantity": 1,
 *                              "price": 86000,
 *                              "buyr_city": "Rostock",
 *                              "buyr_country": "KR",
 *                              buyr_zipx": "11355",
 *                              "vccode": "1",
 *                              "user_name": "test2",
 *                              "date": "20220914",
 *                              "order_num": 1663157064404
 *                          },
 *                          {
 *                              "id": 207,
 *                              "order_state": "결제완료",
 *                              "quantity": 1,
 *                              "price": 86000,
 *                              "buyr_city": "Rostock",
 *                              "buyr_country": "KR",
 *                              buyr_zipx": "11355",
 *                              "vccode": "1",
 *                              "user_name": "test2",
 *                              "date": "20220914",
 *                              "order_num": 1663157064404
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
 *   /api/orders/{orderNum}:
 *    patch:
 *      summary:  "주문 수정"
 *      description: "주문 번호에 해당하는 주문의 데이터를 수정합니다. 배송중, 배송완료라면 송장번호가 추가됩니다."
 *      tags: [Admin Page - Order]
 *      parameters :
 *         - in : path
 *           name : orderNum
 *           required : true
 *           description : 주문번호
 *           schema :
 *              type : String
 *         - in : body
 *           name : data
 *           required : false
 *           description : 수정할 데이터
 *           schema :
 *              type : object
 *              example :
 *                {orderState, quantity, buyrCity, buyrZipx, vccode, userName}
 *      responses:
 *        "200":
 *          description: "수정된 주문 객체를 반환합니다."
 *          content:
 *            application/json:
 *              schema:
 *                  type : object
 *                  example:
 *                          {
 *                              "id": 207,
 *                              "order_state": "배송중",
 *                              "quantity": 1,
 *                              "price": 86000,
 *                              "buyr_city": "Rostock",
 *                              "buyr_country": "KR",
 *                              buyr_zipx": "11355",
 *                              "vccode": "1",
 *                              "user_name": "test2",
 *                              "date": "20220914",
 *                              "order_num": 1663157064404,
 *                              "delivery_num": "1663160659730",
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
 *   /api/orders/{orderNum}:
 *    delete:
 *      summary:  "주문 취소"
 *      description: "주문 번호에 해당하는 주문을 취소합니다."
 *      tags: [Admin Page - Order]
 *      parameters :
 *         - in : path
 *           name : orderNum
 *           required : true
 *           description : 주문번호
 *           schema :
 *              type : String
 *      responses:
 *        "200":
 *          description: "주문 취소 메세지를 반환합니다."
 *          content:
 *            application/json:
 *              schema:
 *                  type : object
 *                  example:
 *                          {
 *                              "message": "주문이 취소되었습니다."
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
