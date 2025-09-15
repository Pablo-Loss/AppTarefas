# App Tarefas - Oryx Tasks

Projeto de lista de tarefas desenvolvido em C# (backend) e JavaScript (frontend), utilizando SQLite como banco de dados e layout com Bootstrap + SB Admin 2.

## 1️⃣ Requisitos de programas
- **.NET SDK 8.0** (ou versão 9.0, usada no projeto)
- Extensões recomendadas no VS Code: Live Server (opcional, para servir o frontend HTML/JS)
- Banco de dados: SQLite (não precisa instalar nada, EF Core cria automaticamente o arquivo)

## 2️⃣ Restaurar pacotes e criar o banco de dados
1. Clonar e abrir o projeto
2. Restaurar pacotes .NET rodando o comando: dotnet restore
3. Criar o banco de dados e tabelas via EF Core Migrations: dotnet ef database update

## 3️⃣ Rodar o backend (C#) e o frontend (HTML/JS)
1. Rodar o seguinte comando: dotnet run (ou dotnet run --launch-profile http)
2. Abrir a pasta **frontend** na IDE
3. Clicar com o botão direito no index.html → Open with Live Server
4. Certifique-se de que a variável API_URL no arquivo frontend/js/script.js corresponde à URL e porta do backend (http://localhost:5043/tarefas). Caso contrário, é só alterar.

## 4️⃣ Funcionalidades da aplicação
- Adicionar, editar, concluir e excluir tarefas
- Separação entre tarefas pendentes e concluídas
- Busca de tarefas na tabela (pendentes e concluídas)
- Mensagens interativas com SweetAlert
- Layout responsivo com Bootstrap + SB Admin 2

## 5️⃣ Aplicação na prática
https://github.com/user-attachments/assets/1cfdf1f6-5dc3-476f-8a5e-531707a9668f

