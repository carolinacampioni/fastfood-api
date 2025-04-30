import { ProductController } from './adapters/in/web/ProductController';
import { TypeORMProductRepository } from './adapters/out/persistence/TypeORMProductRepository';
import { ProductService } from './application/services/ProductService';
import { ProductUseCase } from './domain/ports/in/ProductUseCase';
import { ProductRepository } from './domain/ports/out/ProductRepository';

/**
 * ProductModule
 * 
 * This module handles the dependency injection and configuration for the products domain.
 * It wires together all the components of the hexagonal architecture.
 */
export class ProductModule {
  private productRepository: ProductRepository;
  private productService: ProductUseCase;
  private productController: ProductController;
  private initialized: boolean = false;

  constructor() {
    // Initialize the repository (output adapter)
    this.productRepository = new TypeORMProductRepository();
    
    // Initialize the service (application layer)
    this.productService = new ProductService(this.productRepository);
    
    // Initialize the controller (input adapter)
    this.productController = new ProductController(this.productService);
  }

  /**
   * Initialize the module
   * This method should be called before using the module
   */
  async initialize(): Promise<void> {
    if (!this.initialized) {
      // Initialize the repository
      await (this.productRepository as TypeORMProductRepository).initialize();
      this.initialized = true;
    }
  }

  /**
   * Get the product controller
   * @returns The product controller instance
   */
  getController(): ProductController {
    return this.productController;
  }
}
