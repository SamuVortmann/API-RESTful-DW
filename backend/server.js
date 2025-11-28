// server.js
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const app = express();

const authorsRoutes = require("./src/routes/authorsRoutes");
const booksRoutes = require("./src/routes/booksRoutes");
const authRoutes = require("./src/routes/authRoutes");

const errorHandler = require("./src/middlewares/errorHandler"); 

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/authors", authorsRoutes);
app.use("/books", booksRoutes);

app.get("/", (req, res) => res.send("API funcionando"));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
