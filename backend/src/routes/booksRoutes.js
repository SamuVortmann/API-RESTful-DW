const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");
const validarLivro = require("../validators/livroValidator");
const asyncHandler = require("../middlewares/asyncHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.get("/", asyncHandler(booksController.pegarLivro));
router.get("/:id", asyncHandler(booksController.pegarLivroId));
router.post("/", validarLivro, asyncHandler(booksController.criarLivro));

module.exports = router;
