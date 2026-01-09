const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "segredo_super_secreto";

// Login admin
app.post("/admin/login", (req, res) => {
  const { email, senha } = req.body;

  if (email === "admin@gmail.com" && senha === "123456") {
    const token = jwt.sign({ email }, SECRET, { expiresIn: "2h" });
    return res.json({ token });
  }

  res.status(401).json({ error: "Credenciais inválidas" });
});

// Middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err) => {
    if (err) return res.sendStatus(403);
    next();
  });
}

// Painel protegido
app.get("/admin", auth, (req, res) => {
  res.json({ ok: true });
});

app.listen(3000, () =>
  console.log("🔥 Servidor rodando em http://localhost:3000")
);
