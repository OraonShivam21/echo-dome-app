const { Router } = require("express");
const {
  allMessage,
  sendMessage,
} = require("../controllers/message.controllers");
const auth = require("../middlewares/auth.middlewares");

const router = Router();

router.route("/:chatId").get(auth, allMessage);
router.route("/").post(auth, sendMessage);

module.exports = router;
