const express = require("express");
const router = express.Router();
const authorsController = require("../controllers/authorsController");
const validarAutor = require("../validators/autorValidator");
const asyncHandler = require("../middlewares/asyncHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.get("/", asyncHandler(authorsController.pegarAutor));
router.get("/:id", asyncHandler(authorsController.pegarAutorId));
router.post("/", validarAutor, asyncHandler(authorsController.criarAutor));

module.exports = router;
