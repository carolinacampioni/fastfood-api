/**
 * Order Entity
 * 
 * This is a domain entity that represents an order in our system.
 * It contains the core business logic and validation rules for orders.
 */
export class Order {
  private _id: number | null;
  private _customerName: string;
  private _status: OrderStatus;
  private _totalAmount: number;
  private _items: OrderItem[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: number | null,
    customerName: string,
    status: OrderStatus,
    totalAmount: number,
    items: OrderItem[],
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    // Validate inputs
    if (customerName.trim().length === 0) {
      throw new Error('Customer name cannot be empty');
    }

    if (items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    if (totalAmount <= 0) {
      throw new Error('Total amount must be greater than zero');
    }

    this._id = id;
    this._customerName = customerName;
    this._status = status;
    this._totalAmount = totalAmount;
    this._items = items;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // Getters
  get id(): number | null {
    return this._id;
  }

  get customerName(): string {
    return this._customerName;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }

  get items(): OrderItem[] {
    return [...this._items]; // Return a copy to prevent direct modification
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business methods
  updateStatus(status: OrderStatus): void {
    // Validate status transitions
    if (this._status === OrderStatus.CANCELLED) {
      throw new Error('Cannot update status of a cancelled order');
    }

    if (this._status === OrderStatus.COMPLETED && status !== OrderStatus.CANCELLED) {
      throw new Error('Completed order can only be cancelled');
    }

    this._status = status;
    this._updatedAt = new Date();
  }

  updateCustomerName(customerName: string): void {
    if (customerName.trim().length === 0) {
      throw new Error('Customer name cannot be empty');
    }
    this._customerName = customerName;
    this._updatedAt = new Date();
  }

  // Convert to data transfer object
  toDTO(): OrderDTO {
    return {
      id: this._id,
      customerName: this._customerName,
      status: this._status,
      totalAmount: this._totalAmount,
      items: this._items.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        orderId: item.orderId
      })),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }

  // Create from data transfer object
  static fromDTO(dto: OrderDTO): Order {
    const items = dto.items.map(itemDto => new OrderItem(
      itemDto.id,
      itemDto.productId,
      itemDto.quantity,
      itemDto.unitPrice,
      itemDto.orderId
    ));

    return new Order(
      dto.id,
      dto.customerName,
      dto.status,
      dto.totalAmount,
      items,
      dto.createdAt,
      dto.updatedAt
    );
  }
}

/**
 * OrderItem Entity
 * 
 * This is a domain entity that represents an item in an order.
 */
export class OrderItem {
  private _id: number | null;
  private _productId: number;
  private _quantity: number;
  private _unitPrice: number;
  private _orderId: number | null;

  constructor(
    id: number | null,
    productId: number,
    quantity: number,
    unitPrice: number,
    orderId: number | null
  ) {
    // Validate inputs
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    if (unitPrice <= 0) {
      throw new Error('Unit price must be greater than zero');
    }

    this._id = id;
    this._productId = productId;
    this._quantity = quantity;
    this._unitPrice = unitPrice;
    this._orderId = orderId;
  }

  // Getters
  get id(): number | null {
    return this._id;
  }

  get productId(): number {
    return this._productId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get unitPrice(): number {
    return this._unitPrice;
  }

  get orderId(): number | null {
    return this._orderId;
  }

  // Calculate total price for this item
  get totalPrice(): number {
    return this._quantity * this._unitPrice;
  }
}

// Order status enum
export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Data Transfer Object interfaces
export interface OrderDTO {
  id: number | null;
  customerName: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItemDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemDTO {
  id: number | null;
  productId: number;
  quantity: number;
  unitPrice: number;
  orderId: number | null;
}

// Input DTOs for creating orders
export interface CreateOrderItemDTO {
  productId: number;
  quantity: number;
}

export interface CreateOrderDTO {
  customerName: string;
  items: CreateOrderItemDTO[];
}
