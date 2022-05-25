const express = require('express');
const authController = require("../controllers/authController");
const router = express.Router();

// register
router.post('/signup', authController.register);
// login
router.post('/signin', authController.login);
// refresh
router.post('/refresh', authController.requestRefreshToken);
// logout
router.post("/logout", authController.logout)

module.exports = router;

