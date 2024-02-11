const { Router } = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chat.controllers");
const auth = require("../middlewares/auth.middlewares");

const router = Router();

router.route("/").post(auth, accessChat);
router.route("/").get(auth, fetchChats);
router.route("/group").post(auth, createGroupChat);
router.route("/rename").put(auth, renameGroup);
router.route("/group/remove").put(auth, removeFromGroup);
router.route("/group/add").put(auth, addToGroup);

module.exports = router;
