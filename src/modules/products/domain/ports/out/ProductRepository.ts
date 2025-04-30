import { Product, ProductDTO } from '../../entities/Product';

/**
 * ProductRepository Interface (Output Port)
 * 
 * This interface defines the operations for persisting and retrieving products.
 * It serves as the secondary output port for the hexagonal architecture.
 * Adapters will implement this interface to provide actual data access.
 */
export interface ProductRepository {
  /**
   * Find all products
   * @returns Promise resolving to an array of ProductDTO objects
   */
  findAll(): Promise<ProductDTO[]>;
  
  /**
   * Find a product by its ID
   * @param id The ID of the product to find
   * @returns Promise resolving to a ProductDTO or null if not found
   */
  findById(id: number): Promise<ProductDTO | null>;
  
  /**
   * Find products by category ID
   * @param categoryId The ID of the category to filter by
   * @returns Promise resolving to an array of ProductDTO objects
   */
  findByCategoryId(categoryId: number): Promise<ProductDTO[]>;
  
  /**
   * Save a new product
   * @param product The product entity to save
   * @returns Promise resolving to the saved ProductDTO with generated ID
   */
  save(product: Product): Promise<ProductDTO>;
  
  /**
   * Update an existing product
   * @param product The product entity to update
   * @returns Promise resolving to the updated ProductDTO or null if not found
   */
  update(product: Product): Promise<ProductDTO | null>;
  
  /**
   * Delete a product by its ID
   * @param id The ID of the product to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  delete(id: number): Promise<boolean>;
  
  /**
   * Check if a category exists
   * @param categoryId The ID of the category to check
   * @returns Promise resolving to true if the category exists, false otherwise
   */
  categoryExists(categoryId: number): Promise<boolean>;
}
