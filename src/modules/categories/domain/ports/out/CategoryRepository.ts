import { Category, CategoryDTO } from '../../entities/Category';

/**
 * CategoryRepository Interface (Output Port)
 * 
 * This interface defines the operations for persisting and retrieving categories.
 * It serves as the secondary output port for the hexagonal architecture.
 * Adapters will implement this interface to provide actual data access.
 */
export interface CategoryRepository {
  /**
   * Find all categories
   * @returns Promise resolving to an array of CategoryDTO objects
   */
  findAll(): Promise<CategoryDTO[]>;
  
  /**
   * Find a category by its ID
   * @param id The ID of the category to find
   * @returns Promise resolving to a CategoryDTO or null if not found
   */
  findById(id: number): Promise<CategoryDTO | null>;
  
  /**
   * Save a new category
   * @param category The category entity to save
   * @returns Promise resolving to the saved CategoryDTO with generated ID
   */
  save(category: Category): Promise<CategoryDTO>;
  
  /**
   * Update an existing category
   * @param category The category entity to update
   * @returns Promise resolving to the updated CategoryDTO or null if not found
   */
  update(category: Category): Promise<CategoryDTO | null>;
  
  /**
   * Delete a category by its ID
   * @param id The ID of the category to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  delete(id: number): Promise<boolean>;
  
  /**
   * Check if a category has associated products
   * @param id The ID of the category to check
   * @returns Promise resolving to true if the category has products, false otherwise
   */
  hasProducts(id: number): Promise<boolean>;
}
