import 'reflect-metadata'; // Required for TypeORM decorators
import express, { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import * as winston from 'winston';
import dotenv from 'dotenv';
import { getDataSource } from './lib/typeorm';
import { CategoryModule } from './modules/categories/CategoryModule';
import { ProductModule } from './modules/products/ProductModule';
import { runSeeds } from './database/seeds';
import { ClientModule } from './modules/clients/ClientModule';

dotenv.config();

const app: Express = express();

winston.configure({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FastFoodAPI',
      version: '1.0.0',
      description: 'API para sistema de autoatendimento de fast food',
    },
    servers: [
      { url: 'http://localhost:3000/api' },
    ],
  },
  apis: ['./src/routes/*.js', './src/routes/*.ts', './src/controllers/*.ts'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(express.json());

// Initialize database and start server
async function bootstrap() {
  try {
    // Initialize TypeORM
    const dataSource = await getDataSource();
    winston.info('Database connection established');
    
    // Run database seeds
    await runSeeds(dataSource);
    
    // Initialize modules
    const categoryModule = new CategoryModule();
    const productModule = new ProductModule();
    const clientModule = new ClientModule();
    
    await categoryModule.initialize();
    await productModule.initialize();
    await clientModule.initialize();
    winston.info('Modules initialized');
    
    // Setup routes
    const routes = require('./routes');
    app.use('/api', routes);

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      winston.info(`FastFoodAPI rodando na porta ${PORT}`);
    });
  } catch (error) {
    winston.error('Failed to start the application', error);
    process.exit(1);
  }
}

bootstrap();
