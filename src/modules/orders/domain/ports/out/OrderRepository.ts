import { CreateOrderItemDTO, Order, OrderDTO, OrderStatus } from '../../entities/Order';

/**
 * OrderRepository Interface (Output Port)
 * 
 * This interface defines the operations for persisting and retrieving orders.
 * It serves as the secondary output port for the hexagonal architecture.
 * Adapters will implement this interface to provide actual data access.
 */
export interface OrderRepository {
  /**
   * Find all orders
   * @returns Promise resolving to an array of OrderDTO objects
   */
  findAll(): Promise<OrderDTO[]>;
  
  /**
   * Find an order by its ID
   * @param id The ID of the order to find
   * @returns Promise resolving to an OrderDTO or null if not found
   */
  findById(id: number): Promise<OrderDTO | null>;
  
  /**
   * Save a new order
   * @param order The order entity to save
   * @param items The order items to save
   * @returns Promise resolving to the saved OrderDTO with generated ID
   */
  save(order: Order): Promise<OrderDTO>;
  
  /**
   * Update an existing order
   * @param order The order entity to update
   * @returns Promise resolving to the updated OrderDTO or null if not found
   */
  update(order: Order): Promise<OrderDTO | null>;
  
  /**
   * Delete an order by its ID
   * @param id The ID of the order to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  delete(id: number): Promise<boolean>;
  
  /**
   * Get product details for order items
   * @param items The order items with product IDs
   * @returns Promise resolving to a map of product IDs to their prices
   */
  getProductPrices(productIds: number[]): Promise<Map<number, number>>;
  
  /**
   * Check if products exist
   * @param productIds Array of product IDs to check
   * @returns Promise resolving to an array of product IDs that exist
   */
  validateProducts(productIds: number[]): Promise<number[]>;
}
