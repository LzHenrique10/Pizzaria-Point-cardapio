function cadastrar() {
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  if (!nome || !telefone || !email || !senha || !confirmarSenha) {
    alert("Preencha todos os campos");
    return;
  }

  if (senha.length < 6) {
    alert("A senha deve ter no mínimo 6 caracteres");
    return;
  }

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem");
    return;
  }
/*
  // pegar usuários cadastrados
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // verificar se email já existe
  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    alert("Esse email já está cadastrado");
    return;
  }

  const novoUsuario = {
    id: Date.now(),
    nome,
    telefone,
    email,
    senha,
    role: "cliente"
  };

  usuarios.push(novoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
*/
  alert("Cadastro realizado com sucesso!");

}
