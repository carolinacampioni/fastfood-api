/**
 * Product Entity
 *
 * This is a domain entity that represents a product in our system.
 * It contains the core business logic and validation rules for products.
 */
export class Product {
  private _id: number | null;
  private _name: string;
  private _description: string | null;
  private _price: number;
  private _imageUrl: string | null;
  private _categoryId: number;
  private _stock: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: number | null,
    name: string,
    description: string | null,
    price: number,
    imageUrl: string | null,
    categoryId: number,
    stock: number = 0,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    // Validate inputs
    if (name.trim().length === 0) {
      throw new Error("Product name cannot be empty");
    }

    if (price <= 0) {
      throw new Error("Product price must be greater than zero");
    }

    if (stock < 0) {
      throw new Error("Product stock cannot be negative");
    }

    this._id = id;
    this._name = name;
    this._description = description;
    this._price = price;
    this._imageUrl = imageUrl;
    this._categoryId = categoryId;
    this._stock = stock;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // Getters
  get id(): number | null {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get price(): number {
    return this._price;
  }

  get imageUrl(): string | null {
    return this._imageUrl;
  }

  get categoryId(): number {
    return this._categoryId;
  }

  get stock(): number {
    return this._stock;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business methods
  updateName(name: string): void {
    if (name.trim().length === 0) {
      throw new Error("Product name cannot be empty");
    }
    this._name = name;
    this._updatedAt = new Date();
  }

  updateDescription(description: string | null): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  updatePrice(price: number): void {
    if (price <= 0) {
      throw new Error("Product price must be greater than zero");
    }
    this._price = price;
    this._updatedAt = new Date();
  }

  updateImageUrl(imageUrl: string | null): void {
    this._imageUrl = imageUrl;
    this._updatedAt = new Date();
  }

  updateCategoryId(categoryId: number): void {
    this._categoryId = categoryId;
    this._updatedAt = new Date();
  }

  updateStock(stock: number): void {
    if (stock < 0) {
      throw new Error("Product stock cannot be negative");
    }
    this._stock = stock;
    this._updatedAt = new Date();
  }

  increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }
    this._stock += quantity;
    this._updatedAt = new Date();
  }

  decreaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }
    if (this._stock < quantity) {
      throw new Error("Insufficient stock");
    }
    this._stock -= quantity;
    this._updatedAt = new Date();
  }

  // Convert to data transfer object
  toDTO(): ProductDTO {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      price: this._price,
      imageUrl: this._imageUrl,
      categoryId: this._categoryId,
      stock: this._stock,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  // Create from data transfer object
  static fromDTO(dto: ProductDTO): Product {
    return new Product(
      dto.id,
      dto.name,
      dto.description,
      dto.price,
      dto.imageUrl,
      dto.categoryId,
      dto.stock,
      dto.createdAt,
      dto.updatedAt
    );
  }
}

// Data Transfer Object interface
export interface ProductDTO {
  id: number | null;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  categoryId: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
