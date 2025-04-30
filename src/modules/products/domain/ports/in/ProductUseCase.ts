import { Product, ProductDTO } from '../../entities/Product';

/**
 * ProductUseCase Interface (Input Port)
 * 
 * This interface defines the operations that can be performed on products.
 * It serves as the primary input port for the hexagonal architecture.
 * Application services will implement this interface to provide the actual business logic.
 */
export interface ProductUseCase {
  /**
   * Get all products
   * @returns Promise resolving to an array of ProductDTO objects
   */
  getAllProducts(): Promise<ProductDTO[]>;
  
  /**
   * Get a product by its ID
   * @param id The ID of the product to retrieve
   * @returns Promise resolving to a ProductDTO or null if not found
   */
  getProductById(id: number): Promise<ProductDTO | null>;
  
  /**
   * Get products by category ID
   * @param categoryId The ID of the category to filter by
   * @returns Promise resolving to an array of ProductDTO objects
   */
  getProductsByCategory(categoryId: number): Promise<ProductDTO[]>;
  
  /**
   * Create a new product
   * @param productData The data for the new product
   * @returns Promise resolving to the created ProductDTO
   */
  createProduct(productData: Omit<ProductDTO, 'id'>): Promise<ProductDTO>;
  
  /**
   * Update an existing product
   * @param id The ID of the product to update
   * @param productData The updated product data
   * @returns Promise resolving to the updated ProductDTO or null if not found
   */
  updateProduct(id: number, productData: Partial<Omit<ProductDTO, 'id'>>): Promise<ProductDTO | null>;
  
  /**
   * Delete a product
   * @param id The ID of the product to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  deleteProduct(id: number): Promise<boolean>;
}
