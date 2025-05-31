const express = require("express");
const router = express.Router();
const subscribe=require("../emails/subscribe")

router.post("/",subscribe);

module.exports = router;
