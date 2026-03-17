CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(120),
    cpf VARCHAR(14) UNIQUE,
    endereco TEXT
);

CREATE TABLE veiculos (
    id SERIAL PRIMARY KEY,
    placa VARCHAR(10) NOT NULL UNIQUE,
    marca VARCHAR(60) NOT NULL,
    modelo VARCHAR(60) NOT NULL,
    ano INT NOT NULL,
    cor VARCHAR(30),
    km INT DEFAULT 0,
    cliente_id INT NOT NULL REFERENCES clientes(id)
);

CREATE TABLE ordem_servico (
    id SERIAL PRIMARY KEY,
    numero_os VARCHAR(20) NOT NULL UNIQUE,
    data_entrada TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(40) NOT NULL,
    cliente_id INT NOT NULL REFERENCES clientes(id),
    veiculo_id INT NOT NULL REFERENCES veiculos(id),
    problema_relato TEXT NOT NULL
);

CREATE TABLE diagnostico (
    id SERIAL PRIMARY KEY,
    descricao TEXT NOT NULL,
    pecas TEXT,
    tempo_estimado VARCHAR(30),
    valor_estimado NUMERIC(10,2),
    os_id INT NOT NULL REFERENCES ordem_servico(id),
    mecanico_id INT
);

CREATE TABLE agenda (
    id SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    servico VARCHAR(80) NOT NULL,
    cliente_id INT NOT NULL REFERENCES clientes(id),
    veiculo_id INT NOT NULL REFERENCES veiculos(id),
    status VARCHAR(30) DEFAULT 'agendado'
);

CREATE TABLE historico_servico (
    id SERIAL PRIMARY KEY,
    os_id INT NOT NULL REFERENCES ordem_servico(id),
    status_anterior VARCHAR(40),
    status_novo VARCHAR(40) NOT NULL,
    alterado_por VARCHAR(120),
    data_hora TIMESTAMP NOT NULL DEFAULT NOW(),
    observacao TEXT
);

CREATE UNIQUE INDEX idx_os_veiculo_aberta
ON ordem_servico (veiculo_id)
WHERE status IN ('Aguardando diagnostico', 'Em diagnostico', 'Aguardando aprovacao', 'Em reparo');
