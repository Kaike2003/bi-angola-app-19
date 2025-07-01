# BI Angola - Sistema de Agendamento com Prisma ORM

Sistema completo de agendamento para serviços do Bilhete de Identidade em Angola, agora com **banco de dados real** usando Prisma ORM.

## 🚀 Configuração Rápida

### 1. Instalar Dependências
\`\`\`bash
npm install
\`\`\`

### 2. Configurar Banco de Dados
\`\`\`bash
# Gerar cliente Prisma
npm run db:generate

# Criar e aplicar migrações
npm run db:push

# Popular banco com dados iniciais
npm run db:seed
\`\`\`

### 3. Executar Aplicação
\`\`\`bash
npm run dev
\`\`\`

**Pronto! 🎉** Acesse: http://localhost:3000

## 📧 Contas de Teste

### 👨‍💼 **Administrador**
- **Email:** admin@bi.gov.ao
- **Senha:** admin123
- **Acesso:** Dashboard completo + Gestão

### 👤 **Usuário Regular**
- **Email:** user@example.com  
- **Senha:** user123
- **Acesso:** Agendamentos

### 👤 **Usuário Adicional**
- **Email:** maria@example.com
- **Senha:** maria123
- **Acesso:** Agendamentos

## 🗄️ **Banco de Dados com Prisma**

### **Tecnologias:**
- ✅ **Prisma ORM** - ORM moderno e type-safe
- ✅ **SQLite** - Banco local para desenvolvimento
- ✅ **JWT** - Autenticação segura
- ✅ **bcryptjs** - Hash de senhas
- ✅ **Migrations** - Controle de versão do schema

### **Comandos Úteis:**
\`\`\`bash
# Ver banco de dados visualmente
npm run db:studio

# Resetar e popular banco
npm run db:push && npm run db:seed

# Gerar cliente após mudanças no schema
npm run db:generate
\`\`\`

## ✨ Funcionalidades Implementadas

### 🔐 **Autenticação Real**
- ✅ **JWT Tokens** - Autenticação segura
- ✅ **Hash de senhas** - bcryptjs
- ✅ **HTTP-only cookies** - Segurança extra
- ✅ **Middleware de auth** - Proteção de rotas

### 📊 **Banco de Dados Completo**
- ✅ **Users** - Usuários e admins
- ✅ **Postos** - Locais de atendimento
- ✅ **Services** - Tipos de serviços
- ✅ **Appointments** - Agendamentos
- ✅ **Relacionamentos** - Foreign keys e joins

### 🏢 **Sistema de Agendamento**
- ✅ **CRUD completo** - Create, Read, Update, Delete
- ✅ **Validações** - Horários disponíveis
- ✅ **Referências únicas** - Números de agendamento
- ✅ **Status tracking** - Estados dos agendamentos

### 🛡️ **Segurança**
- ✅ **Validação de dados** - Server-side
- ✅ **Sanitização** - Prevenção de SQL injection
- ✅ **Autorização** - Controle de acesso por role
- ✅ **Cookies seguros** - HttpOnly e Secure

## 📁 Estrutura do Projeto

\`\`\`
├── prisma/
│   ├── schema.prisma      # Schema do banco
│   └── seed.ts           # Dados iniciais
├── app/api/
│   ├── auth/             # Endpoints de autenticação
│   ├── services/         # API de serviços
│   ├── postos/          # API de postos
│   └── appointments/     # API de agendamentos
├── lib/
│   ├── prisma.ts        # Cliente Prisma
│   └── auth.ts          # Utilitários de auth
└── contexts/
    └── auth-context.tsx  # Context de autenticação
\`\`\`

## 🔧 Configuração de Produção

### **Variáveis de Ambiente (.env):**
\`\`\`env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta-jwt-muito-segura"
NEXTAUTH_SECRET="sua-chave-nextauth-secreta"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

### **Para PostgreSQL (Produção):**
\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/bi_angola"
\`\`\`

## 🚀 Deploy

### **Vercel:**
1. Conectar repositório
2. Configurar variáveis de ambiente
3. Usar PostgreSQL (Vercel Postgres)
4. Deploy automático

### **Comandos de Deploy:**
\`\`\`bash
# Build para produção
npm run build

# Aplicar migrações em produção
npx prisma migrate deploy

# Popular banco em produção
npm run db:seed
\`\`\`

## 📊 Schema do Banco

### **Tabelas Principais:**
- **users** - Usuários do sistema
- **postos** - Locais de atendimento
- **services** - Tipos de serviços
- **appointments** - Agendamentos
- **posto_services** - Relação N:N entre postos e serviços

### **Relacionamentos:**
- User → Appointments (1:N)
- Posto → Appointments (1:N)
- Service → Appointments (1:N)
- Posto ↔ Services (N:N)

---

**Sistema Empresarial com Banco de Dados Real** 🇦🇴

*Agora com Prisma ORM, autenticação JWT e persistência completa!*
