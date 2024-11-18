# Projeto de Climatização: Áreas Arborizadas vs. Áreas Sem Árvores
Este projeto é uma aplicação web que permite comparar as condições de climatização em áreas arborizadas e áreas sem árvores. O objetivo é conscientizar sobre os benefícios de áreas arborizadas, monitorando e exibindo dados de temperatura e umidade coletados via um dispositivo IoT (Arduino). A aplicação inclui um backend em Node.js para gerenciar a API e um frontend em React para exibir visualmente os dados em gráficos interativos.

## Funcionalidades
- **Visualização de dados de temperatura e umidade**: Gráficos que comparam condições entre áreas arborizadas e áreas sem árvores.
- **API RESTful**: Backend que fornece dados de temperatura e umidade em tempo real do MongoDB.
- **Documentação OpenAPI**: Documentação da API com Swagger para facilitar a compreensão e o teste de endpoints.

## Tecnologias Utilizadas
- **Banco de dados/**: MongoDB Atlas
- **backend/**: Node.js, Express, MongoDB
- **frontend/**: React com React Router, Chart.js
- **Documentação/**: Swagger (OpenAPI)
- **Outros/**: Grafana para visualização avançada dos dados, caso desejado

## Estrutura do Projeto
├── frontend/           # Aplicação React
│   ├── src/
│   │   ├── components/    # Componentes dos gráficos (TemperatureChart, HumidityChart, etc.)
│   │   ├── App.js         # Configuração de rotas e componentes principais
│   │   ├── Navbar.js      # Barra de navegação
│   │   └── ...
│   └── ...
├── backend/            # Servidor Express e configuração da API
│   ├── server.js        # Servidor Node.js com rotas para a API
│   ├── .env             # Variáveis de ambiente, incluindo MONGO_URI
│   └── ...
├── README.md           # Documentação do projeto
└── openapi.yaml        # Descrição OpenAPI (Swagger) da API

## Pré-requisitos
Node.js (versão 14 ou superior)
MongoDB Atlas: Banco de dados na nuvem com conexão configurada
NPM ou Yarn: Para instalar pacotes e dependências

### Backend

#### Configuração e Execução

1. Instale as dependências: `backend`:
   ```cd backend
    npm install
   ```

2. Configuração do MongoDB:
   ```
    MONGO_URI= Configure a URL
    PORT=5000
   ```

3. Inicie o servidor
   ```node server.js
   ```

### Frontend

#### Configuração e Execução

1. Instale as dependências necessárias:
   ```cd frontend
    npm install
   ```

2. Navegue até a pasta `frontend`:
   ```bash
   cd frontend
   ```

## Endpoints da API

- **GET /api/data/**: Retorna dados de temperatura ou umidade.
Parâmetro: type (temperature ou humidity)
- **GET /api/data/:id**: Retorna dados específicos de um sensor.
- **POST /api/data**: Cadastra novo dado de sensor.
- **PUT /api/data/:id**: Atualiza dado de sensor específico.
- **DELETE /api/data/:id**: Deleta dado de sensor específico.
- **GET /api/sensors**: Retorna lista de todos os sensores.
- **POST /api/sensors**: Cadastra novo sensor.
- **PUT /api/sensors/:id**: Atualiza sensor específico.

-**Exemplo de resposta**:
```[
    {
        "timestamp": "2024-10-29T12:00:00Z",
        "temperature": 22,
        "area_type": "arborizada"
    },
    {
        "timestamp": "2024-10-29T12:00:00Z",
        "temperature": 30,
        "area_type": "sem_arvores"
    }
    ]
```
#### Componentes do Frontend

- **TemperatureChart/**: Gráfico de linha mostrando comparações de temperatura.
- **HumidityChart/**: Gráfico de barras para dados de umidade.
- **ComparisonChart/**: Gráfico radar comparativo para visualização geral dos dados.

#### Anotações sobre o Projeto
**Coleta de Dados/**: Dados de temperatura e umidade são coletados de um dispositivo IoT, com as medições salvas no MongoDB em uma coleção chamada arduino_data.
**MongoDB Compass:/**: Ferramenta recomendada para explorar o banco de dados MongoDB localmente.

## Contribuição
- Leonardo Victor Pereira Ferreira
- João Pedro Andrade Cintra
- Claudio Matos
