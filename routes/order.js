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

module.exports = router;
