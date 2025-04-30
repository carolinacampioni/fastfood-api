import { ProductEntity } from '../../modules/products/adapters/out/persistence/entities/Product.entity';
import { CategoryEntity } from '../../modules/categories/adapters/out/persistence/entities/Category.entity';
import { DataSource } from 'typeorm';

/**
 * Seed initial products into the database
 * @param dataSource TypeORM DataSource
 */
export const seedProducts = async (dataSource: DataSource): Promise<void> => {
  const productRepository = dataSource.getRepository(ProductEntity);
  
  // Check if products already exist
  const count = await productRepository.count();
  if (count > 0) {
    console.log('Products already seeded, skipping...');
    return;
  }
  
  // Get category IDs
  const categoryRepository = dataSource.getRepository(CategoryEntity);
  const categories = await categoryRepository.find();
  
  if (categories.length === 0) {
    console.log('No categories found, cannot seed products');
    return;
  }
  
  // Find category IDs by name
  const getCategoryIdByName = (name: string) => {
    const category = categories.find(c => c.name === name);
    return category ? category.id : null;
  };
  
  const lanchesId = getCategoryIdByName('Lanches');
  const bebidasId = getCategoryIdByName('Bebidas');
  const acompanhamentosId = getCategoryIdByName('Acompanhamentos');
  const sobremesasId = getCategoryIdByName('Sobremesas');
  
  // Initial products
  const products = [
    // Lanches
    {
      name: 'Hambúrguer Clássico',
      description: 'Hambúrguer de carne bovina, queijo, alface, tomate e molho especial',
      price: 18.90,
      imageUrl: 'https://example.com/hamburger.jpg',
      categoryId: lanchesId,
      stock: 50
    },
    {
      name: 'Cheeseburger Duplo',
      description: 'Dois hambúrgueres de carne bovina, queijo cheddar, bacon e molho especial',
      price: 24.90,
      imageUrl: 'https://example.com/cheeseburger.jpg',
      categoryId: lanchesId,
      stock: 40
    },
    
    // Bebidas
    {
      name: 'Refrigerante Cola',
      description: 'Refrigerante de cola 350ml',
      price: 5.90,
      imageUrl: 'https://example.com/cola.jpg',
      categoryId: bebidasId,
      stock: 100
    },
    {
      name: 'Suco de Laranja',
      description: 'Suco de laranja natural 300ml',
      price: 7.90,
      imageUrl: 'https://example.com/orange-juice.jpg',
      categoryId: bebidasId,
      stock: 80
    },
    
    // Acompanhamentos
    {
      name: 'Batata Frita',
      description: 'Porção de batata frita crocante',
      price: 9.90,
      imageUrl: 'https://example.com/fries.jpg',
      categoryId: acompanhamentosId,
      stock: 60
    },
    {
      name: 'Onion Rings',
      description: 'Anéis de cebola empanados',
      price: 11.90,
      imageUrl: 'https://example.com/onion-rings.jpg',
      categoryId: acompanhamentosId,
      stock: 45
    },
    
    // Sobremesas
    {
      name: 'Sundae de Chocolate',
      description: 'Sorvete de baunilha com calda de chocolate',
      price: 8.90,
      imageUrl: 'https://example.com/sundae.jpg',
      categoryId: sobremesasId,
      stock: 30
    },
    {
      name: 'Milkshake de Morango',
      description: 'Milkshake cremoso de morango',
      price: 12.90,
      imageUrl: 'https://example.com/milkshake.jpg',
      categoryId: sobremesasId,
      stock: 25
    }
  ];
  
  // Insert products
  try {
    await productRepository.insert(products);
    console.log(`Seeded ${products.length} products successfully`);
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};
