import { Category, CategoryDTO } from '../../domain/entities/Category';
import { CategoryUseCase } from '../../domain/ports/in/CategoryUseCase';
import { CategoryRepository } from '../../domain/ports/out/CategoryRepository';

/**
 * CategoryService
 * 
 * This service implements the CategoryUseCase interface and contains the business logic
 * for category operations. It uses the CategoryRepository (output port) for data access.
 */
export class CategoryService implements CategoryUseCase {
  private categoryRepository: CategoryRepository;

  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async getAllCategories(): Promise<CategoryDTO[]> {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(id: number): Promise<CategoryDTO | null> {
    return this.categoryRepository.findById(id);
  }

  async createCategory(categoryData: Omit<CategoryDTO, 'id'>): Promise<CategoryDTO> {
    // Create category entity with validation
    const category = new Category(
      null,
      categoryData.name,
      categoryData.description
    );

    // Save to repository
    return this.categoryRepository.save(category);
  }

  async updateCategory(id: number, categoryData: Partial<Omit<CategoryDTO, 'id'>>): Promise<CategoryDTO | null> {
    // Check if category exists
    const existingCategoryDTO = await this.categoryRepository.findById(id);
    if (!existingCategoryDTO) {
      return null;
    }

    // Create category entity from existing data
    const category = Category.fromDTO(existingCategoryDTO);

    // Update fields that are provided
    if (categoryData.name !== undefined) {
      category.updateName(categoryData.name);
    }
    if (categoryData.description !== undefined) {
      category.updateDescription(categoryData.description);
    }

    // Update in repository
    return this.categoryRepository.update(category);
  }

  async deleteCategory(id: number): Promise<boolean> {
    // Check if category has associated products
    const hasProducts = await this.categoryRepository.hasProducts(id);
    if (hasProducts) {
      throw new Error('Cannot delete category with associated products');
    }

    return this.categoryRepository.delete(id);
  }
}
