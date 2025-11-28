const express = require("express");
const router = express.Router();
const authorsController = require("../controllers/authorsController");
const { validarCriarAutor, validarAtualizarAutor } = require("../validators/authorValidator");
const asyncHandler = require("../middlewares/asyncHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

// CRUD SIMPLES - Autores
router.get("/", asyncHandler(authorsController.pegarAutor));                    // GET - Listar todos
router.post("/", validarCriarAutor, asyncHandler(authorsController.criarAutor)); // POST - Criar
router.put("/:id", validarAtualizarAutor, asyncHandler(authorsController.atualizarAutor)); // PUT - Atualizar
router.delete("/:id", asyncHandler(authorsController.removerAutor));            // DELETE - Remover

module.exports = router;
