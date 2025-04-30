import { Category, CategoryDTO } from '../../entities/Category';

/**
 * CategoryUseCase Interface (Input Port)
 * 
 * This interface defines the operations that can be performed on categories.
 * It serves as the primary input port for the hexagonal architecture.
 * Application services will implement this interface to provide the actual business logic.
 */
export interface CategoryUseCase {
  /**
   * Get all categories
   * @returns Promise resolving to an array of CategoryDTO objects
   */
  getAllCategories(): Promise<CategoryDTO[]>;
  
  /**
   * Get a category by its ID
   * @param id The ID of the category to retrieve
   * @returns Promise resolving to a CategoryDTO or null if not found
   */
  getCategoryById(id: number): Promise<CategoryDTO | null>;
  
  /**
   * Create a new category
   * @param categoryData The data for the new category
   * @returns Promise resolving to the created CategoryDTO
   */
  createCategory(categoryData: Omit<CategoryDTO, 'id'>): Promise<CategoryDTO>;
  
  /**
   * Update an existing category
   * @param id The ID of the category to update
   * @param categoryData The updated category data
   * @returns Promise resolving to the updated CategoryDTO or null if not found
   */
  updateCategory(id: number, categoryData: Partial<Omit<CategoryDTO, 'id'>>): Promise<CategoryDTO | null>;
  
  /**
   * Delete a category
   * @param id The ID of the category to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  deleteCategory(id: number): Promise<boolean>;
}
