# Mundo Delas

E-commerce full stack para a loja Mundo Delas, com vitrine de produtos, carrinho, lista de desejos, fluxo de pedidos, rastreamento e atendimento via WhatsApp.

## Tecnologias

- Frontend: Vite, TypeScript, HTML renderizado por componentes, CSS global e localStorage.
- Backend: Node.js, Express, TypeScript, Sequelize e MySQL.
- Monorepo: npm workspaces.

## Requisitos

- Node.js 22 ou superior.
- npm.
- MySQL rodando localmente ou em um servidor acessivel.
- Git.

## Estrutura

```txt
Mundo.DL/
  backend/      API Express + Sequelize
  frontend/     SPA Vite + TypeScript
  css/ js/      versao antiga mantida no repositorio
  pages/        paginas antigas
```

## Configuracao Do Backend

Crie o arquivo `backend/.env` com base em `backend/.env.example`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=mundo_delas
PORT=3000
```

O backend cria o banco automaticamente se ele ainda nao existir.

## Instalacao

Na raiz do projeto:

```bash
npm install
```

## Sincronizar Banco

Depois de configurar o `.env`, rode:

```bash
npm run db:sync -w backend
```

Esse comando cria/atualiza as tabelas e popula produtos iniciais.

## Rodar Em Desenvolvimento

Para rodar frontend e backend juntos:

```bash
npm run dev
```

URLs padrao:

- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:3000`
- Health check: `http://127.0.0.1:3000/health`

Tambem e possivel rodar separadamente:

```bash
npm run dev -w backend
npm run dev -w frontend
```

## Acessar Por Outro Computador Na Mesma Rede

Descubra o IP da maquina que esta rodando o projeto:

```powershell
ipconfig
```

Depois rode o frontend expondo na rede:

```powershell
$env:VITE_API_URL="http://SEU_IP:3000"
npm run dev -w frontend -- --host 0.0.0.0
```

No outro computador, acesse:

```txt
http://SEU_IP:5173
```

Se nao abrir, libere as portas `5173` e `3000` no Firewall do Windows.

## Build

```bash
npm run build
```

O build compila backend e frontend.

## Funcionalidades Atuais

- Home institucional.
- Pagina de produtos separada.
- Busca, filtro por categoria e ordenacao.
- Carrinho persistido no localStorage.
- Checkout com criacao de pedido no backend.
- Integracao com WhatsApp para finalizar compra.
- Botao de WhatsApp por produto.
- Lista de desejos persistida no localStorage.
- Area "Minha conta" preparada para cadastro/login.
- Cadastro basico de clientes no backend.
- Pagina "Meus pedidos" preparada para login futuro.
- Pagina "Rastrear pedido" consultando o backend.
- Status de pedido preparado no banco.
- Footer institucional.

## Rotas Principais Da API

```txt
GET    /health
GET    /products
GET    /products/:id
POST   /products
PUT    /products/:id
DELETE /products/:id
POST   /orders
GET    /orders/:id
GET    /orders/track/:identifier
GET    /customers
GET    /customers/:id
POST   /customers
```

## Fluxo De Pedido

1. O frontend carrega produtos pelo endpoint `/products`.
2. O usuario adiciona itens ao carrinho.
3. Ao finalizar, o frontend envia `POST /orders`.
4. O backend valida itens, calcula total, cria pedido e itens do pedido.
5. O estoque dos produtos e decrementado dentro de uma transacao.
6. O frontend redireciona para o WhatsApp com a mensagem do pedido.

## Observacoes De Seguranca

- O arquivo `.env` nao deve ser versionado.
- Rotas administrativas de produtos ainda precisam de autenticacao antes de producao.
- A autenticacao JWT de clientes ainda nao foi implementada.
- Para producao, substitua `sequelize.sync` por migrations.

## Roadmap Sugerido

- Autenticacao JWT para clientes e administradores.
- Dashboard administrativo.
- Pedidos vinculados ao cliente logado.
- Wishlist persistida no banco.
- Upload de imagens.
- Migrations versionadas.
- Testes automatizados.
- Deploy com variaveis por ambiente.
