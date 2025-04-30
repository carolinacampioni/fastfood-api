import { CategoryEntity } from '../../modules/categories/adapters/out/persistence/entities/Category.entity';
import { DataSource } from 'typeorm';

/**
 * Seed initial categories into the database
 * @param dataSource TypeORM DataSource
 */
export const seedCategories = async (dataSource: DataSource): Promise<void> => {
  const categoryRepository = dataSource.getRepository(CategoryEntity);
  
  // Check if categories already exist
  const count = await categoryRepository.count();
  if (count > 0) {
    console.log('Categories already seeded, skipping...');
    return;
  }
  
  // Initial categories
  const categories = [
    { name: 'Lanches', description: 'Hambúrgueres, sanduíches e outros lanches' },
    { name: 'Bebidas', description: 'Refrigerantes, sucos, água e outras bebidas' },
    { name: 'Acompanhamentos', description: 'Batatas fritas, onion rings e outros acompanhamentos' },
    { name: 'Sobremesas', description: 'Sorvetes, milk-shakes e outras sobremesas' }
  ];
  
  // Insert categories
  await categoryRepository.insert(categories);
  console.log(`Seeded ${categories.length} categories successfully`);
};
