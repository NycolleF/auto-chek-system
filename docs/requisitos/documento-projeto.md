# Documento do Projeto - AutoCheck Manager

## 1. Nome do sistema

AutoCheck Manager

## 2. Problema que resolve

A AutoCheck Center opera processos manuais e via WhatsApp, gerando perda de dados, falta de rastreabilidade e baixa previsibilidade operacional.

O sistema resolve:

- Perda de informacoes de clientes e veiculos
- Falta de historico de servicos
- Dificuldade de acompanhar status dos carros na oficina
- Agenda desorganizada
- Excesso de contatos de clientes para saber andamento

## 3. Usuarios

### Administrador

- Acesso total ao sistema
- Cadastro de funcionarios
- Visualizacao de relatorios
- Exclusao de registros (regra RN03)

### Recepcionista

- Cadastro de clientes
- Cadastro de veiculos
- Abertura de ordem de servico
- Agendamento de servicos

### Mecanico

- Consulta ordens de servico
- Registro de diagnostico
- Atualizacao de status
- Registro de conclusao do servico

### Cliente

- Acesso via link publico seguro
- Consulta de status da OS
- Consulta de diagnostico e previsao de entrega
- Aprovacao ou recusa de orcamento

## 4. Funcionalidades

- RF01: Cadastrar cliente
- RF02: Cadastrar veiculo
- RF03: Abrir ordem de servico
- RF04: Registrar diagnostico
- RF05: Atualizar status da OS
- RF06: Gerenciar agenda
- RF07: Cliente acompanhar status

## 5. Banco de dados

### Tabela CLIENTES

- id (PK)
- nome
- telefone
- email
- cpf
- endereco

### Tabela VEICULOS

- id (PK)
- placa
- marca
- modelo
- ano
- cor
- km
- cliente_id (FK -> CLIENTES.id)

### Tabela ORDEM_SERVICO

- id (PK)
- numero_os (unico)
- data_entrada
- status
- cliente_id (FK -> CLIENTES.id)
- veiculo_id (FK -> VEICULOS.id)
- problema_relato

### Tabela DIAGNOSTICO

- id (PK)
- descricao
- pecas
- tempo_estimado
- valor_estimado
- os_id (FK -> ORDEM_SERVICO.id)
- mecanico_id (FK -> FUNCIONARIOS.id)

### Tabela AGENDA

- id (PK)
- data
- hora
- servico
- cliente_id (FK -> CLIENTES.id)
- veiculo_id (FK -> VEICULOS.id)
- status

### Tabela HISTORICO_SERVICO (sugestao)

- id (PK)
- os_id (FK -> ORDEM_SERVICO.id)
- status_anterior
- status_novo
- alterado_por
- data_hora
- observacao

## 6. Fluxo do sistema

1. Cliente chega na oficina
2. Recepcao cadastra cliente
3. Recepcao cadastra veiculo
4. Recepcao abre OS
5. Mecanico registra diagnostico
6. Cliente aprova ou recusa orcamento
7. Oficina executa servico
8. OS e finalizada e veiculo entregue

## Regras de negocio

- RN01: Nao pode existir duas OS abertas para o mesmo veiculo
- RN02: Um veiculo precisa estar vinculado a um cliente
- RN03: Somente administrador pode excluir registros
- RN04: Uma OS so pode ser finalizada apos diagnostico

## Respostas aos desafios de projeto

### 1) Como evitar placas duplicadas?

- Normalizar placa para maiuscula e sem espacos/hifen
- Definir restricao UNIQUE no banco
- Validar no backend antes de inserir

### 2) Como gerar automaticamente o numero da OS?

- Gerar no backend com sequencia transacional
- Formato sugerido: OS-YYYY-000001
- Garantir indice unico em numero_os

### 3) Como mostrar status para o cliente?

- Gerar token publico por OS (URL assinada)
- Exibir status atual, diagnostico e previsao
- Mostrar linha do tempo das etapas

### 4) Como permitir upload de fotos do carro?

- Upload para storage (Firebase Storage ou S3)
- Salvar apenas URL e metadados no banco
- Validar extensao, tamanho e permissao por perfil

### 5) Como registrar historico de servicos?

- Criar tabela de historico de eventos por OS
- Registrar toda mudanca de status e diagnostico
- Exibir historico cronologico no painel interno e no portal do cliente
