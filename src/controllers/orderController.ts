import { Request, Response } from 'express';
import { getDataSource } from '../lib/typeorm';
import { OrderEntity } from '../modules/orders/adapters/out/persistence/entities/Order.entity';
import { OrderItemEntity } from '../modules/orders/adapters/out/persistence/entities/OrderItem.entity';
import { ProductEntity } from '../modules/products/adapters/out/persistence/entities/Product.entity';
import { OrderStatus } from '../modules/orders/domain/entities/Order';

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const dataSource = await getDataSource();
    const orderRepository = dataSource.getRepository(OrderEntity);
    const orders = await orderRepository.find({
      relations: ['items', 'items.product']
    });
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dataSource = await getDataSource();
    const orderRepository = dataSource.getRepository(OrderEntity);
    const order = await orderRepository.findOne({
      where: { id: Number(id) },
      relations: ['items', 'items.product']
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerName, items } = req.body;
    
    if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Customer name and at least one item are required' });
    }
    
    const dataSource = await getDataSource();
    const productRepository = dataSource.getRepository(ProductEntity);
    const orderRepository = dataSource.getRepository(OrderEntity);
    const orderItemRepository = dataSource.getRepository(OrderItemEntity);
    
    // Start a transaction
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Validate products and calculate total amount
      let totalAmount = 0;
      const orderItems: OrderItemEntity[] = [];
      
      for (const item of items) {
        const { productId, quantity } = item;
        
        if (!productId || !quantity || quantity <= 0) {
          return res.status(400).json({ error: 'Each item must have a valid productId and quantity' });
        }
        
        // Check if product exists and has enough stock
        const product = await productRepository.findOne({
          where: { id: Number(productId) }
        });
        
        if (!product) {
          return res.status(404).json({ error: `Product with ID ${productId} not found` });
        }
        
        if (product.stock < quantity) {
          return res.status(400).json({ error: `Not enough stock for product ${product.name}` });
        }
        
        // Create order item
        const orderItem = new OrderItemEntity();
        orderItem.productId = Number(productId);
        orderItem.quantity = Number(quantity);
        orderItem.unitPrice = product.price;
        
        // Update total amount
        totalAmount += orderItem.quantity * orderItem.unitPrice;
        
        // Update product stock
        product.stock -= quantity;
        await queryRunner.manager.save(product);
        
        orderItems.push(orderItem);
      }
      
      // Create order
      const order = new OrderEntity();
      order.customerName = customerName;
      order.status = OrderStatus.PENDING;
      order.totalAmount = totalAmount;
      
      // Save order
      const savedOrder = await queryRunner.manager.save(order);
      
      // Save order items with order ID
      for (const item of orderItems) {
        item.orderId = savedOrder.id;
        await queryRunner.manager.save(item);
      }
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      // Fetch the complete order with items
      const completeOrder = await orderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['items', 'items.product']
      });
      
      return res.status(201).json(completeOrder);
    } catch (error) {
      // Rollback transaction in case of error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }
    
    const dataSource = await getDataSource();
    const orderRepository = dataSource.getRepository(OrderEntity);
    
    const existingOrder = await orderRepository.findOne({
      where: { id: Number(id) }
    });
    
    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Validate status transitions
    if (existingOrder.status === OrderStatus.CANCELLED) {
      return res.status(400).json({ error: 'Cannot update status of a cancelled order' });
    }
    
    if (existingOrder.status === OrderStatus.COMPLETED && status !== OrderStatus.CANCELLED) {
      return res.status(400).json({ error: 'Completed order can only be cancelled' });
    }
    
    // Update status
    existingOrder.status = status;
    
    const updatedOrder = await orderRepository.save(existingOrder);
    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const dataSource = await getDataSource();
    const orderRepository = dataSource.getRepository(OrderEntity);
    const productRepository = dataSource.getRepository(ProductEntity);
    
    // Start a transaction
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const existingOrder = await orderRepository.findOne({
        where: { id: Number(id) },
        relations: ['items']
      });
      
      if (!existingOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      if (existingOrder.status === OrderStatus.CANCELLED) {
        return res.status(400).json({ error: 'Order is already cancelled' });
      }
      
      // Update order status
      existingOrder.status = OrderStatus.CANCELLED;
      await queryRunner.manager.save(existingOrder);
      
      // Restore product stock
      for (const item of existingOrder.items) {
        const product = await productRepository.findOne({
          where: { id: item.productId }
        });
        
        if (product) {
          product.stock += item.quantity;
          await queryRunner.manager.save(product);
        }
      }
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
