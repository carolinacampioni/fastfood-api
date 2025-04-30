import { Repository } from 'typeorm';
import { Category, CategoryDTO } from '../../../domain/entities/Category';
import { CategoryRepository } from '../../../domain/ports/out/CategoryRepository';
import { CategoryEntity } from './entities/Category.entity';
import { getDataSource } from '../../../../../lib/typeorm';

/**
 * TypeORMCategoryRepository
 * 
 * This class implements the CategoryRepository interface using TypeORM.
 * It serves as an output adapter for database operations.
 */
export class TypeORMCategoryRepository implements CategoryRepository {
  private repository: Repository<CategoryEntity>;

  constructor() {
    // Initialize repository - will be set in the initialize method
    this.repository = null;
  }

  /**
   * Initialize the repository
   * This method should be called before using any other methods
   */
  async initialize(): Promise<void> {
    const dataSource = await getDataSource();
    this.repository = dataSource.getRepository(CategoryEntity);
  }

  async findAll(): Promise<CategoryDTO[]> {
    const categories = await this.repository.find();

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description
    }));
  }

  async findById(id: number): Promise<CategoryDTO | null> {
    const category = await this.repository.findOne({
      where: { id },
      relations: ['products']
    });

    if (!category) {
      return null;
    }

    return {
      id: category.id,
      name: category.name,
      description: category.description
    };
  }

  async save(category: Category): Promise<CategoryDTO> {
    const categoryEntity = new CategoryEntity();
    categoryEntity.name = category.name;
    categoryEntity.description = category.description;

    const savedCategory = await this.repository.save(categoryEntity);

    return {
      id: savedCategory.id,
      name: savedCategory.name,
      description: savedCategory.description
    };
  }

  async update(category: Category): Promise<CategoryDTO | null> {
    // Ensure category has an ID
    if (category.id === null) {
      throw new Error('Cannot update category without ID');
    }

    // Check if category exists
    const existingCategory = await this.repository.findOne({
      where: { id: category.id }
    });

    if (!existingCategory) {
      return null;
    }

    // Update category
    existingCategory.name = category.name;
    existingCategory.description = category.description;

    const updatedCategory = await this.repository.save(existingCategory);

    return {
      id: updatedCategory.id,
      name: updatedCategory.name,
      description: updatedCategory.description
    };
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async hasProducts(id: number): Promise<boolean> {
    const count = await this.repository
      .createQueryBuilder('category')
      .innerJoin('category.products', 'product')
      .where('category.id = :id', { id })
      .getCount();

    return count > 0;
  }
}
