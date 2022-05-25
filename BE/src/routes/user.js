const express = require('express');
const userController = require("../controllers/userController");
const router = express.Router();

router.patch('/role', userController.changeRole);

module.exports = router;