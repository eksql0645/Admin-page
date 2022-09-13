const { Router } = require("express");
const router = Router();
const { orderService } = require("../service");

router.post("/", orderService.addOrder);
router.get("/:orderNum", orderService.getOrder);
router.patch("/:orderNum", orderService.setOrder);
router.delete("/:orderNum", orderService.deleteOrder);

module.exports = router;
