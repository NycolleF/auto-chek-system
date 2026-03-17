# AutoCheck Manager

Sistema de gestao para oficina mecanica com foco no fluxo inicial de atendimento: cadastro de cliente, cadastro de veiculo e abertura de ordem de servico (OS).

## Status do projeto

Projeto em fase inicial (MVP).

- Frontend funcional em HTML, CSS e JavaScript
- Persistencia local em `localStorage`
- Estrutura de backend criada, ainda sem implementacao versionada

## Problema que o sistema resolve

O AutoCheck Manager busca reduzir operacoes manuais na oficina e melhorar:

- Rastreabilidade de clientes, veiculos e OS
- Organizacao do fluxo de entrada de servicos
- Controle de regras basicas de negocio

## Funcionalidades atuais

- Cadastro de clientes
  - Validacao de CPF duplicado
- Cadastro de veiculos
  - Vinculo obrigatorio com cliente (RN02)
  - Padronizacao de placa
  - Bloqueio de placa duplicada
- Abertura de ordem de servico (OS)
  - Numero sequencial automatico no formato `OS-ANO-XXXXXX`
  - Filtro de veiculos por cliente
  - Bloqueio de duas OS abertas para o mesmo veiculo (RN01)
- Tema da interface (claro/escuro) com persistencia

## Regras de negocio aplicadas no MVP

- RN01: nao permite duas OS abertas para o mesmo veiculo
- RN02: veiculo deve estar vinculado a um cliente
- Validacao extra: CPF e placa sem duplicidade no frontend

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (vanilla)
- `localStorage` (persistencia local no navegador)

## Estrutura do repositorio

```text
auto-chek-system/
|- backend/
|  |- controllers/
|  |- database/
|  |- models/
|  |- routes/
|  |- services/
|- docs/
|  |- diagramas/
|  |- requisitos/
|     |- documento-projeto.md
|     |- modelo-banco.sql
|- frontend/
|  |- app.js
|  |- index.html
|  |- styles.css
|  |- components/
|  |- pages/
|     |- cadastro-cliente.html
|     |- cadastro-veiculo.html
|     |- abrir-os.html
|  |- services/
```

## Como executar localmente

Como o MVP atual e frontend estatico, nao precisa instalar dependencias.

1. Clone o repositorio:

```bash
git clone https://github.com/NycolleF/auto-chek-system.git
```

1. Entre na pasta do projeto:

```bash
cd auto-chek-system
```

1. Abra o arquivo `frontend/index.html` no navegador.

Opcional: usar extensao Live Server no VS Code para facilitar testes.

## Banco de dados (documentacao)

O modelo relacional inicial esta em:

- `docs/requisitos/modelo-banco.sql`

Esse arquivo descreve tabelas como `clientes`, `veiculos`, `ordem_servico`, `diagnostico`, `agenda` e `historico_servico`, alem de indice para reforcar a RN01 no banco.

## Documentacao complementar

- Requisitos e regras do sistema: `docs/requisitos/documento-projeto.md`
- Modelo inicial do banco: `docs/requisitos/modelo-banco.sql`
