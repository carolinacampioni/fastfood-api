import { CreateOrderDTO, Order, OrderDTO, OrderStatus } from '../../entities/Order';

/**
 * OrderUseCase Interface (Input Port)
 * 
 * This interface defines the operations that can be performed on orders.
 * It serves as the primary input port for the hexagonal architecture.
 * Application services will implement this interface to provide the actual business logic.
 */
export interface OrderUseCase {
  /**
   * Get all orders
   * @returns Promise resolving to an array of OrderDTO objects
   */
  getAllOrders(): Promise<OrderDTO[]>;
  
  /**
   * Get an order by its ID
   * @param id The ID of the order to retrieve
   * @returns Promise resolving to an OrderDTO or null if not found
   */
  getOrderById(id: number): Promise<OrderDTO | null>;
  
  /**
   * Create a new order
   * @param orderData The data for the new order
   * @returns Promise resolving to the created OrderDTO
   */
  createOrder(orderData: CreateOrderDTO): Promise<OrderDTO>;
  
  /**
   * Update the status of an order
   * @param id The ID of the order to update
   * @param status The new status for the order
   * @returns Promise resolving to the updated OrderDTO or null if not found
   */
  updateOrderStatus(id: number, status: OrderStatus): Promise<OrderDTO | null>;
  
  /**
   * Delete an order
   * @param id The ID of the order to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  deleteOrder(id: number): Promise<boolean>;
}
