import { Product, ProductDTO } from '../../domain/entities/Product';
import { ProductUseCase } from '../../domain/ports/in/ProductUseCase';
import { ProductRepository } from '../../domain/ports/out/ProductRepository';

/**
 * ProductService
 * 
 * This service implements the ProductUseCase interface and contains the business logic
 * for product operations. It uses the ProductRepository (output port) for data access.
 */
export class ProductService implements ProductUseCase {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async getAllProducts(): Promise<ProductDTO[]> {
    return this.productRepository.findAll();
  }

  async getProductById(id: number): Promise<ProductDTO | null> {
    return this.productRepository.findById(id);
  }

  async getProductsByCategory(categoryId: number): Promise<ProductDTO[]> {
    return this.productRepository.findByCategoryId(categoryId);
  }

  async createProduct(productData: Omit<ProductDTO, 'id'>): Promise<ProductDTO> {
    // Check if category exists
    const categoryExists = await this.productRepository.categoryExists(productData.categoryId);
    if (!categoryExists) {
      throw new Error(`Category with ID ${productData.categoryId} not found`);
    }

    // Create product entity with validation
    const product = new Product(
      null,
      productData.name,
      productData.description,
      productData.price,
      productData.imageUrl,
      productData.categoryId,
      productData.stock,
      productData.createdAt,
      productData.updatedAt
    );

    // Save to repository
    return this.productRepository.save(product);
  }

  async updateProduct(id: number, productData: Partial<Omit<ProductDTO, 'id'>>): Promise<ProductDTO | null> {
    // Check if product exists
    const existingProductDTO = await this.productRepository.findById(id);
    if (!existingProductDTO) {
      return null;
    }

    // Check if category exists if it's being updated
    if (productData.categoryId !== undefined) {
      const categoryExists = await this.productRepository.categoryExists(productData.categoryId);
      if (!categoryExists) {
        throw new Error(`Category with ID ${productData.categoryId} not found`);
      }
    }

    // Create product entity from existing data
    const product = Product.fromDTO(existingProductDTO);

    // Update fields that are provided
    if (productData.name !== undefined) {
      product.updateName(productData.name);
    }
    if (productData.description !== undefined) {
      product.updateDescription(productData.description);
    }
    if (productData.price !== undefined) {
      product.updatePrice(productData.price);
    }
    if (productData.imageUrl !== undefined) {
      product.updateImageUrl(productData.imageUrl);
    }
    if (productData.categoryId !== undefined) {
      product.updateCategoryId(productData.categoryId);
    }
    if (productData.stock !== undefined) {
      product.updateStock(productData.stock);
    }

    // Update in repository
    return this.productRepository.update(product);
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}
