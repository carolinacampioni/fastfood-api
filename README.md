# FastFood API

API para sistema de autoatendimento de fast food.

## Arquitetura Hexagonal

Este projeto utiliza a Arquitetura Hexagonal (também conhecida como "Ports and Adapters") para organizar o código de forma modular e desacoplada.

### Estrutura do Projeto

```
src/
├── modules/                  # Módulos da aplicação organizados por domínio
│   ├── categories/           # Módulo de categorias
│   │   ├── adapters/         # Adaptadores para interfaces externas
│   │   │   ├── in/           # Adaptadores de entrada (controllers)
│   │   │   └── out/          # Adaptadores de saída (repositories)
│   │   ├── application/      # Lógica de aplicação
│   │   │   └── services/     # Serviços que implementam os casos de uso
│   │   └── domain/           # Regras de negócio e entidades
│   │       ├── entities/     # Entidades de domínio
│   │       └── ports/        # Interfaces (portas)
│   │           ├── in/       # Portas de entrada (casos de uso)
│   │           └── out/      # Portas de saída (repositórios)
│   └── products/             # Módulo de produtos (estrutura similar)
├── lib/                      # Bibliotecas e configurações
├── configs/                  # Configurações da aplicação
└── routes/                   # Rotas da API
```

### Princípios da Arquitetura Hexagonal

1. **Separação de Responsabilidades**: O código é organizado em camadas com responsabilidades bem definidas.
2. **Independência de Frameworks**: A lógica de negócio é independente de frameworks e bibliotecas externas.
3. **Testabilidade**: A arquitetura facilita a escrita de testes unitários e de integração.
4. **Adaptabilidade**: É fácil trocar implementações de adaptadores sem afetar a lógica de negócio.

### Camadas da Arquitetura

1. **Domain (Domínio)**
   - Contém as entidades de negócio e regras de domínio
   - Define as interfaces (portas) para interagir com o domínio

2. **Application (Aplicação)**
   - Implementa os casos de uso da aplicação
   - Orquestra as entidades de domínio para realizar operações de negócio

3. **Adapters (Adaptadores)**
   - **Input Adapters**: Adaptam requisições externas para o formato esperado pelo domínio
   - **Output Adapters**: Implementam as interfaces de saída definidas pelo domínio

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- Swagger

## Dados Iniciais

Ao iniciar a aplicação, os seguintes dados são automaticamente criados no banco de dados:

### Categorias

1. **Lanches** - Hambúrgueres, sanduíches e outros lanches
2. **Bebidas** - Refrigerantes, sucos, água e outras bebidas
3. **Acompanhamentos** - Batatas fritas, onion rings e outros acompanhamentos
4. **Sobremesas** - Sorvetes, milk-shakes e outras sobremesas

### Produtos

**Lanches:**
- Hambúrguer Clássico - R$ 18,90
- Cheeseburger Duplo - R$ 24,90

**Bebidas:**
- Refrigerante Cola - R$ 5,90
- Suco de Laranja - R$ 7,90

**Acompanhamentos:**
- Batata Frita - R$ 9,90
- Onion Rings - R$ 11,90

**Sobremesas:**
- Sundae de Chocolate - R$ 8,90
- Milkshake de Morango - R$ 12,90

Cada produto já possui um estoque inicial e campos de data de criação e atualização.

## Configuração e Execução

### Pré-requisitos

- Node.js
- PostgreSQL
- Docker (opcional)

### Instalação Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Iniciar o PostgreSQL localmente usando Docker
docker run --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=fastfood_db -p 5432:5432 -d postgres:15-alpine

# Iniciar o servidor de desenvolvimento
npm run dev
```

### Execução com Docker

```bash
# Construir e iniciar os containers
docker-compose up -d

# Ver logs da aplicação
docker-compose logs -f fastfood-api

# Parar os containers
docker-compose down

# Reconstruir os containers após alterações
docker-compose up -d --build
```

### Comandos TypeORM

```bash
# Gerar uma nova migração
npm run migration:generate -- nome-da-migracao

# Executar migrações
npm run migration:run
```

## Documentação da API

A documentação da API está disponível em `/api-docs` quando o servidor estiver em execução.
