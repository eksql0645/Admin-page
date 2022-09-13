const { Router } = require("express");
const router = Router();
const { orderService } = require("../service");

router.post("/", orderService.addOrder);
module.exports = router;
