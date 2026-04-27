# 🐾 Resgatinhos Unifor

> Plataforma web dedicada a promover a adoção responsável dos gatinhos resgatados no campus da Unifor, em parceria com o curso de Medicina Veterinária.

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-blue)
![React](https://img.shields.io/badge/Frontend-React_&_Vite-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)

## 📖 Sobre o Projeto

O **Resgatinhos Unifor** nasceu da necessidade de conectar os felinos resgatados no campus universitário a lares amorosos e seguros. O sistema moderniza o processo de adoção, oferecendo um catálogo dinâmico de animais disponíveis, informações de saúde transparentes e, futuramente, um painel administrativo para a gestão completa do fluxo de adoções.

## ✨ Funcionalidades

### 🖥️ Frontend (Interface do Usuário)
* **Catálogo Interativo:** Grid responsivo com todos os gatinhos disponíveis, pendentes ou adotados.
* **Filtros Avançados:** Pesquisa em tempo real por nome, sexo, status de castração e vacinação.
* **Perfis Detalhados:** Páginas individuais (`/gato/:id`) com histórico médico completo (FIV/FeLV) e formulário de adoção integrado.
* **UI/UX Moderna:** Animações fluidas de scroll (Intersection Observer), hovers interativos e design focado em acessibilidade.

### ⚙️ Backend e Área Admin (Em Desenvolvimento)
* Modelagem de dados relacional para Gatos, Administradores e Formulários de Adoção.
* API RESTful com Node.js e Express.
* Painel Administrativo protegido por autenticação para gerenciar o status dos gatos e analisar métricas de adoção.

## 🛠️ Tecnologias Utilizadas

**Frontend:**
* [React.js](https://reactjs.org/)
* [Vite](https://vitejs.dev/)
* React Router DOM (Roteamento SPA)
* CSS3 (Animações Keyframes e CSS Grid/Flexbox)

**Backend & Banco de Dados (Roadmap):**
* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [PostgreSQL](https://www.postgresql.org/)

## 🚀 Como Executar o Projeto Localmente

Siga as instruções abaixo para rodar o ambiente de desenvolvimento na sua máquina.

### Pré-requisitos
* Node.js instalado (versão 16 ou superior)
* Git instalado
* PostgreSQL instalado (para a fase de backend)

### Passos

1. **Clone o repositório:**
```bash
git clone [https://github.com/lpeixotomagalhaes/adocao-gatos-unifor.git](https://github.com/lpeixotomagalhaes/adocao-gatos-unifor.git)
Acesse a pasta do projeto:

Bash
cd adocao-gatos-unifor
Instale as dependências do Frontend:

Bash
npm install
Inicie o servidor de desenvolvimento (Vite):

Bash
npm run dev
O aplicativo estará rodando em http://localhost:5173.

📁 Estrutura do Projeto (Frontend)
Plaintext
adocao-gatos-unifor/
├── src/
│   ├── assets/          # Imagens estáticas (Hero, Logos, etc)
│   ├── components/      # Componentes reutilizáveis (Navbar, Footer, Cards)
│   ├── pages/           # Páginas principais (Home, Adote, Contato, PerfilGato)
│   ├── App.jsx          # Configuração de Rotas
│   └── index.css        # Variáveis de cor e animações globais
└── package.json
👨‍💻 Autor
Lucas Peixoto Magalhães

GitHub: @lpeixotomagalhaes

Feito com 💙 para ajudar os animais.