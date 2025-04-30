import { CreateOrderDTO, Order, OrderDTO, OrderItem, OrderStatus } from '../../domain/entities/Order';
import { OrderUseCase } from '../../domain/ports/in/OrderUseCase';
import { OrderRepository } from '../../domain/ports/out/OrderRepository';

/**
 * OrderService
 * 
 * This service implements the OrderUseCase interface and contains the business logic
 * for order operations. It uses the OrderRepository (output port) for data access.
 */
export class OrderService implements OrderUseCase {
  private orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async getAllOrders(): Promise<OrderDTO[]> {
    return this.orderRepository.findAll();
  }

  async getOrderById(id: number): Promise<OrderDTO | null> {
    return this.orderRepository.findById(id);
  }

  async createOrder(orderData: CreateOrderDTO): Promise<OrderDTO> {
    // Validate that all products exist
    const productIds = orderData.items.map(item => item.productId);
    const validProductIds = await this.orderRepository.validateProducts(productIds);
    
    // Check if any products are invalid
    const invalidProductIds = productIds.filter(id => !validProductIds.includes(id));
    if (invalidProductIds.length > 0) {
      throw new Error(`Products with IDs ${invalidProductIds.join(', ')} not found`);
    }
    
    // Get product prices
    const productPrices = await this.orderRepository.getProductPrices(productIds);
    
    // Create order items
    const orderItems: OrderItem[] = orderData.items.map(item => {
      const price = productPrices.get(item.productId);
      if (!price) {
        throw new Error(`Price not found for product ${item.productId}`);
      }
      
      return new OrderItem(
        null,
        item.productId,
        item.quantity,
        price,
        null
      );
    });
    
    // Calculate total amount
    const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // Create order entity with validation
    const order = new Order(
      null,
      orderData.customerName,
      OrderStatus.PENDING,
      totalAmount,
      orderItems
    );
    
    // Save to repository
    return this.orderRepository.save(order);
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<OrderDTO | null> {
    // Check if order exists
    const existingOrderDTO = await this.orderRepository.findById(id);
    if (!existingOrderDTO) {
      return null;
    }
    
    // Create order entity from existing data
    const order = Order.fromDTO(existingOrderDTO);
    
    try {
      // Update status with business rules validation
      order.updateStatus(status);
      
      // Update in repository
      return this.orderRepository.update(order);
    } catch (error) {
      // Re-throw domain errors
      throw error;
    }
  }

  async deleteOrder(id: number): Promise<boolean> {
    // Check if order exists
    const existingOrderDTO = await this.orderRepository.findById(id);
    if (!existingOrderDTO) {
      return false;
    }
    
    // Only allow deleting orders that are PENDING or CANCELLED
    if (existingOrderDTO.status !== OrderStatus.PENDING && existingOrderDTO.status !== OrderStatus.CANCELLED) {
      throw new Error(`Cannot delete order with status ${existingOrderDTO.status}`);
    }
    
    return this.orderRepository.delete(id);
  }
}
