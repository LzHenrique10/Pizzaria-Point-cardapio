const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "segredo_super_secreto";

const produtosPath = path.join(__dirname, "produtos.json");

// ================= LOGIN ADMIN =================
app.post("/admin/login", (req, res) => {
  const { email, senha } = req.body;

  if (email === "admin@gmail.com" && senha === "123456") {
    const token = jwt.sign({ email }, SECRET, { expiresIn: "2h" });
    return res.json({ token });
  }

  res.status(401).json({ error: "Credenciais inválidas" });
});

// ================= MIDDLEWARE =================
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err) => {
    if (err) return res.sendStatus(403);
    next();
  });
}

// ================= PAINEL =================
app.get("/admin", auth, (req, res) => {
  res.json({ ok: true });
});

// ================= PRODUTOS =================

// listar produtos (público)
app.get("/produtos", (req, res) => {
  if (!fs.existsSync(produtosPath)) {
    fs.writeFileSync(produtosPath, "[]");
  }

  const produtos = JSON.parse(fs.readFileSync(produtosPath));
  res.json(produtos);
});

// cadastrar produto (ADMIN)
app.post("/admin/produtos", auth, (req, res) => {
  const { nome, descricao, preco, imagem, categoria } = req.body;

  if (!nome || !preco || !categoria) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  if (!fs.existsSync(produtosPath)) {
    fs.writeFileSync(produtosPath, "[]");
  }

  const produtos = JSON.parse(fs.readFileSync(produtosPath));

  produtos.push({
    id: Date.now(),
    nome,
    descricao,
    preco,
    imagem,
    categoria
  });

  fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, 2));

  res.json({ message: "Produto cadastrado com sucesso" });
});

// ================= SERVER =================
app.listen(3000, () =>
  console.log("🔥 Servidor rodando em http://localhost:3000")
);
