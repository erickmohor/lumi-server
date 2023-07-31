# Demo - YouTube (frontend)
https://youtu.be/vgyPPFpO63Q


# Descrição do projeto
Nesse projeto é possível listar e fazer o upload de faturas de energia elétrica da CEMIG, em pdf. Além disso é possível cadastrar e autenticar usuários.

## No frontend:
Ao acessar, é possível fazer o login ou cadastrar-se para ter acesso ao dashboard.
No dashboard contém a página principal, que fornece um resumo de dados obtidos através de todas as faturas já registradas no sistema por aquele usuário. E também possui a página de 'Faturas', onde é possível fazer o upload da fatura em pdf e visualizar todas as faturas registradas e seus dados.

## No backend:
No backend é possível criar, autenticar e visualizar um determinado usuário. Além disso é possível registrar e mostrar uma ou mais faturas de energia elétrica.
Os dados das faturas da CEMIG, em pdf, são extraídos e inseridos no banco de dados PostgreSQL.


# Funcionalidades
É possível:

## Usuário
- Cadastrar;
- Autenticar;
- Visualizar dados do usuário autenticado.

## Fatura de Energia Elétrica
- Registrar fatura;
- Mostrar dados de uma determinada fatura;
- Mostrar todas as faturas de um determinado usuário.

### Fatura de Energia Elétrica - Dados
Os dados que são extraídos do pdf e salvos no banco de dados são:
- Número do cliente;
- Número da instalação;
- Número da Nota Fiscal;
- Mês de referência;
- Data de Vencimento;
- Energia Elétrica (unidade, quantidade, preço unitário e valor total);
- Energia injetada HFP (unidade, quantidade, preço unitário e valor total);
- Energia comp. s/ ICMS (unidade, quantidade, preço unitário e valor total);
- Contrib. Ilum. Publica Municipal;
- Valor Total.


# Tech Stack
- **Frontend:** Next, Typescript
- **Backend:** Node, Fastify, Typescript, Prisma
- **Database:** PostgreSQL


# Dependências
Fastify Multer, Fastify JWT, PdfReader, Zod, Prisma, Supertest, Vitest entre outros.


# Variáveis de ambiente
`NODE_ENV`
`JWT_SECRET`
`DATABASE_URL` (URL do banco de dados PostgreSQL)


# Para rodar localmente
Clone o diretório
```bash
git clone https://github.com/erickmohor/lumi-server
```

Vá no diretório do projeto
```bash
cd lumi-server
```

Instale as dependências
```bash
npm install
```

Crie o .env com as variáveis preenchidas (ou pode usar o .env.example, basta renomear para .env),

## Docker
Esse projeto contém o docker compose, que contém as instruções e dados para criar um banco de dados PostgreSQL. Para executar o docker compose e criar o banco de dados em seu docker, digite o comando a seguir:
```bash
docker compose up -d
```
** Lembrando que é necessário possuir o Docker instalado em sua máquina.

Caso queira parar de executar o banco de dados:
```bash
docker compose stop
```

## Prisma
Gere o Prisma Client
```bash
npx prisma generate
```

Com o docker e banco de dados sendo executados, execute o Prisma Migrate. Após executar o código abaixo, será feita uma pergunta, digite 'initial migration' (por exemplo)
```bash
npx prisma migrate dev
```

Após criar o .env com as variáveis, configurar o Prisma, Docker e estar com o banco de dados sendo executado no Docker, execute:
```bash
npm run start:dev
```

# POSTGRESQL
Caso queira acessar o banco de dados PostgreSQL:
```bash
npx prisma studio
```
** É necessário estar com o docker e banco de dados sendo executados.


# Testes
Esse projeto contém testes unitários e testes end to end. Siga os comandos abaixo para executá-los.

** Importante: Diversos testes utilizam um arquivo chamado 'cemig-bill.pdf'. Esse arquivo é uma fatura qualquer de energia elétrica da CEMIG e não consta nesse diretório por questão de segurança de dados. Para esses testes serem executados com sucesso, você deve possuir uma fatura de energia elétrica da CEMIG, deve renomear essa conta para 'cemig-bill' e incluir esse arquivo no diretório 'src/utils/test-files/wrong-pdf.pdf'.

# Testes unitários
Para executar esses testes não é necessário estar com o docker e banco de dados sendo executados.
```bash
npm run test
```

# Testes E2E
Para executar esses testes é necessário estar com o docker e banco de dados sendo executados.
```bash
npm run test:e2e
```