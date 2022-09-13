const { Router } = require("express");
const router = Router();
const { orderService } = require("../service");

router.post("/", orderService.addOrder);
router.get("/search", orderService.seekOrderList);
router.get("/:orderNum", orderService.getOrder);
router.get("/", orderService.getOrderList);

module.exports = router;
