
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const asyncHandler = require("../middlewares/asyncHandler"); 
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));

router.post("/refresh", asyncHandler(authController.refresh));
router.post("/logout", asyncHandler(authController.logout));

router.get("/me", authMiddleware, asyncHandler(authController.me));

module.exports = router;
