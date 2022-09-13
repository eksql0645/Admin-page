const { Router } = require("express");
const router = Router();
const orderRouter = require("./order");

router.use("/orders", orderRouter);

module.exports = router;