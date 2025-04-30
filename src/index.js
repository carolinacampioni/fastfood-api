const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const logger = require('winston');
const routes = require('./routes');
require('dotenv').config();

const app = express();

// Configuração do logger
logger.configure({
  transports: [
    new logger.transports.Console(),
    new logger.transports.File({ filename: 'logs/app.log' })
  ]
});

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FastFoodAPI',
      version: '1.0.0',
      description: 'API para sistema de autoatendimento de fast food',
    },
    servers: [
      { url: 'http://localhost:3000' },
    ],
  },
  apis: ['./src/routes/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(express.json());
app.use('/api', routes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`FastFoodAPI rodando na porta ${PORT}`);
});
