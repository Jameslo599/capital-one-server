const express = require("express");
const router = express.Router();
const accountsController = require("../controllers/accounts");
const authController = require("../controllers/auth");
const emailController = require("../controllers/email");
const transactionsController = require("../controllers/transactions");
const { ensureAuth } = require("../middleware/auth");
const upload = require("../middleware/multer");

// router.get("/user", ensureAuth, accountsController.getAccount);
// router.post("/login", authController.postLogin);
// router.get("/getlogged?", authController.getLogged);
// router.delete("/session", authController.logout);
// router.post("/create", authController.postSignup);

// //Account username/password management
// router.post("/forgot", authController.postForgot);
// router.post("/email", emailController.postEmailUsername);
// router.put("/reset/:username", authController.putResetPassword);

// //Account information management
// router.post("/avatar", upload.single("file"), accountsController.postAvatar);
// router.put("/update/greeting", accountsController.putGreeting);
// router.put("/update/address", accountsController.putAddress);
// router.put("/update/mail-address", accountsController.putMailAddress);
// router.put("/update/phone", accountsController.putPhone);
// router.put("/update/email", accountsController.putEmail);
// router.put("/update/username", accountsController.putUsername);
// router.put("/update/password", accountsController.putPassword);

// //Transactions
// router.put("/bank/deposit", transactionsController.putDeposit);
// router.put("/bank/withdraw", transactionsController.putWithdraw);
// router.put("/bank/send", transactionsController.putSend);
// router.get("/bank/history", transactionsController.getHistory);

router.get(
  "https://capital-one-server.onrender.com/user",
  ensureAuth,
  accountsController.getAccount
);
router.post(
  "https://capital-one-server.onrender.com/login",
  authController.postLogin
);
router.get(
  "https://capital-one-server.onrender.com/getlogged?",
  authController.getLogged
);
router.delete(
  "https://capital-one-server.onrender.com/session",
  authController.logout
);
router.post(
  "https://capital-one-server.onrender.com/create",
  authController.postSignup
);

//Account username/password management
router.post(
  "https://capital-one-server.onrender.com/forgot",
  authController.postForgot
);
router.post(
  "https://capital-one-server.onrender.com/email",
  emailController.postEmailUsername
);
router.put(
  "https://capital-one-server.onrender.com/reset/:username",
  authController.putResetPassword
);

//Account information management
router.post(
  "https://capital-one-server.onrender.com/avatar",
  upload.single("file"),
  accountsController.postAvatar
);
router.put(
  "https://capital-one-server.onrender.com/update/greeting",
  accountsController.putGreeting
);
router.put(
  "https://capital-one-server.onrender.com/update/address",
  accountsController.putAddress
);
router.put(
  "https://capital-one-server.onrender.com/update/mail-address",
  accountsController.putMailAddress
);
router.put(
  "https://capital-one-server.onrender.com/update/phone",
  accountsController.putPhone
);
router.put(
  "https://capital-one-server.onrender.com/update/email",
  accountsController.putEmail
);
router.put(
  "https://capital-one-server.onrender.com/update/username",
  accountsController.putUsername
);
router.put(
  "https://capital-one-server.onrender.com/update/password",
  accountsController.putPassword
);

//Transactions
router.put(
  "https://capital-one-server.onrender.com/bank/deposit",
  transactionsController.putDeposit
);
router.put(
  "https://capital-one-server.onrender.com/bank/withdraw",
  transactionsController.putWithdraw
);
router.put(
  "https://capital-one-server.onrender.com/bank/send",
  transactionsController.putSend
);
router.get(
  "https://capital-one-server.onrender.com/bank/history",
  transactionsController.getHistory
);

module.exports = router;
