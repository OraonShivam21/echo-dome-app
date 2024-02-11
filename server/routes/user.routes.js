const { Router } = require("express");
const {
  allUsers,
  registerUser,
  authUser,
} = require("../controllers/user.controllers");
const auth = require("../middlewares/auth.middlewares");

const router = Router();

router.route("/").get(auth, allUsers);
router.route("/").post(registerUser);
router.route("/login").post(authUser);

module.exports = router;
