const { Router } = require("express");
const router = Router();
const { orderService } = require("../service");

router.post("/", orderService.addOrder);
router.get("/:orderNum", orderService.getOrder);

module.exports = router;
