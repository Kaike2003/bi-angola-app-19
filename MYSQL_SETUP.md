# 🐬 Configuração MySQL para BI Angola

## 📋 Pré-requisitos

### 1. Instalar MySQL
\`\`\`bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# macOS (Homebrew)
brew install mysql

# Windows
# Baixar do site oficial: https://dev.mysql.com/downloads/mysql/
\`\`\`

### 2. Iniciar MySQL
\`\`\`bash
# Linux/macOS
sudo systemctl start mysql
# ou
brew services start mysql

# Windows
# Usar MySQL Workbench ou Services
\`\`\`

## 🔧 Configuração do Banco

### 1. Acessar MySQL
\`\`\`bash
mysql -u root -p
\`\`\`

### 2. Criar usuário e banco (opcional)
\`\`\`sql
-- Criar usuário específico
CREATE USER 'bi_angola'@'localhost' IDENTIFIED BY 'senha_segura';

-- Criar banco
CREATE DATABASE bi_angola_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Dar permissões
GRANT ALL PRIVILEGES ON bi_angola_db.* TO 'bi_angola'@'localhost';
FLUSH PRIVILEGES;

-- Sair
EXIT;
\`\`\`

### 3. Configurar .env
\`\`\`env
# Usando root (desenvolvimento)
DATABASE_URL="mysql://root:sua_senha@localhost:3306/bi_angola_db"

# Ou usando usuário específico
DATABASE_URL="mysql://bi_angola:senha_segura@localhost:3306/bi_angola_db"
\`\`\`

## 🚀 Executar Aplicação

### 1. Instalar dependências
\`\`\`bash
npm install
\`\`\`

### 2. Configurar banco
\`\`\`bash
# Gerar cliente Prisma
npm run db:generate

# Criar tabelas
npm run db:push

# Popular com dados iniciais
npm run db:seed
\`\`\`

### 3. Executar aplicação
\`\`\`bash
npm run dev
\`\`\`

## 🛠️ Comandos Úteis

\`\`\`bash
# Ver banco no navegador
npm run db:studio

# Reset completo do banco
npm run db:reset

# Criar nova migration
npm run db:migrate

# Ver logs do MySQL
sudo tail -f /var/log/mysql/error.log
\`\`\`

## 🔍 Verificar Conexão

### Teste rápido no MySQL:
\`\`\`sql
USE bi_angola_db;
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM postos;
SELECT COUNT(*) FROM appointments;
\`\`\`

## ⚠️ Troubleshooting

### Erro de conexão:
1. Verificar se MySQL está rodando
2. Verificar credenciais no .env
3. Verificar se o banco existe
4. Verificar firewall/portas

### Erro de permissões:
\`\`\`sql
GRANT ALL PRIVILEGES ON bi_angola_db.* TO 'seu_usuario'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

### Erro de charset:
\`\`\`sql
ALTER DATABASE bi_angola_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
