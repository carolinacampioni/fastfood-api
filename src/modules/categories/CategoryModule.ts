import { CategoryController } from './adapters/in/web/CategoryController';
import { TypeORMCategoryRepository } from './adapters/out/persistence/TypeORMCategoryRepository';
import { CategoryService } from './application/services/CategoryService';
import { CategoryUseCase } from './domain/ports/in/CategoryUseCase';
import { CategoryRepository } from './domain/ports/out/CategoryRepository';

/**
 * CategoryModule
 * 
 * This module handles the dependency injection and configuration for the categories domain.
 * It wires together all the components of the hexagonal architecture.
 */
export class CategoryModule {
  private categoryRepository: CategoryRepository;
  private categoryService: CategoryUseCase;
  private categoryController: CategoryController;
  private initialized: boolean = false;

  constructor() {
    // Initialize the repository (output adapter)
    this.categoryRepository = new TypeORMCategoryRepository();
    
    // Initialize the service (application layer)
    this.categoryService = new CategoryService(this.categoryRepository);
    
    // Initialize the controller (input adapter)
    this.categoryController = new CategoryController(this.categoryService);
  }

  /**
   * Initialize the module
   * This method should be called before using the module
   */
  async initialize(): Promise<void> {
    if (!this.initialized) {
      // Initialize the repository
      await (this.categoryRepository as TypeORMCategoryRepository).initialize();
      this.initialized = true;
    }
  }

  /**
   * Get the category controller
   * @returns The category controller instance
   */
  getController(): CategoryController {
    return this.categoryController;
  }
}
