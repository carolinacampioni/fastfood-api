import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as winston from 'winston';

// Load environment variables
dotenv.config();

// Create and export the TypeORM DataSource
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'fastfood',
  synchronize: process.env.NODE_ENV !== 'production', // Auto-create database schema in non-production environments
  logging: process.env.NODE_ENV !== 'production',
  entities: [
    'src/modules/**/adapters/out/persistence/entities/*.entity.ts'
  ],
  migrations: ['src/migrations/*.ts'],
  connectTimeoutMS: 10000
});

// Singleton instance of DataSource
let dataSource: DataSource;

export const getDataSource = async (): Promise<DataSource> => {
  if (!dataSource) {
    try {
      dataSource = await AppDataSource.initialize();
      winston.info('Database connection established successfully');
    } catch (error) {
      winston.error('Failed to connect to the database. Please make sure PostgreSQL is running.');
      winston.error(`Connection details: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
      winston.error(`Error details: ${error.message}`);
      
      // For development, provide helpful instructions
      if (process.env.NODE_ENV !== 'production') {
        winston.info('For local development, you can start PostgreSQL with Docker:');
        winston.info('docker run --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=fastfood_db -p 5432:5432 -d postgres:15-alpine');
      }
      
      throw error;
    }
  }
  return dataSource;
};
