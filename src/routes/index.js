const { Router } = require("express");
const { sendEmail } = require("../controllers/index");
const router = Router();

router.post("/send-email", sendEmail);

module.exports = router;
