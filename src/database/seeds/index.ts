import { DataSource } from 'typeorm';
import { seedCategories } from './categorySeed';
import { seedProducts } from './productSeed';

/**
 * Run all seed functions
 * @param dataSource TypeORM DataSource
 */
export const runSeeds = async (dataSource: DataSource): Promise<void> => {
  console.log('Starting database seeding...');
  
  try {
    // Run category seeds first (products depend on categories)
    await seedCategories(dataSource);
    
    // Run product seeds
    await seedProducts(dataSource);
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};
