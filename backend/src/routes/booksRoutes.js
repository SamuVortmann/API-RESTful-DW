const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");
const { validarCriarLivro, validarAtualizarLivro } = require("../validators/booksValidator");
const asyncHandler = require("../middlewares/asyncHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

// CRUD COMPLETO - Livros
router.get("/", asyncHandler(booksController.pegarLivro));           // GET - Listar todos
router.get("/:id", asyncHandler(booksController.pegarLivroId));     // GET - Buscar por ID
router.post("/", validarCriarLivro, asyncHandler(booksController.criarLivro));      // POST - Criar (campos obrigatórios)
router.put("/:id", validarAtualizarLivro, asyncHandler(booksController.atualizarLivro)); // PUT - Atualizar (parcial)
router.delete("/:id", asyncHandler(booksController.removerLivro));  // DELETE - Remover

module.exports = router;
