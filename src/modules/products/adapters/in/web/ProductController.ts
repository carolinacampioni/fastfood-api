import { Request, Response } from 'express';
import { ProductUseCase } from '../../../domain/ports/in/ProductUseCase';

/**
 * ProductController
 * 
 * This controller serves as an input adapter for the web interface.
 * It translates HTTP requests into calls to the ProductUseCase (input port).
 */
export class ProductController {
  private productUseCase: ProductUseCase;

  constructor(productUseCase: ProductUseCase) {
    this.productUseCase = productUseCase;
  }

  /**
   * Get all products
   */
  getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.productUseCase.getAllProducts();
      return res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get a product by ID
   */
  getProductById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await this.productUseCase.getProductById(Number(id));
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get products by category
   */
  getProductsByCategory = async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.params;
      const products = await this.productUseCase.getProductsByCategory(Number(categoryId));
      
      return res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Create a new product
   */
  createProduct = async (req: Request, res: Response) => {
    try {
      const { name, description, price, imageUrl, categoryId, stock } = req.body;
      
      if (!name || !price || !categoryId) {
        return res.status(400).json({ error: 'Name, price, and categoryId are required' });
      }
      
      const newProduct = await this.productUseCase.createProduct({
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        categoryId: Number(categoryId),
        stock: stock ? Number(stock) : 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      
      // Handle specific domain errors
      if (error instanceof Error) {
        if (error.message.includes('Category with ID')) {
          return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('Product name') || 
            error.message.includes('Product price') ||
            error.message.includes('Product stock')) {
          return res.status(400).json({ error: error.message });
        }
      }
      
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Update an existing product
   */
  updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, price, imageUrl, categoryId, stock } = req.body;
      
      const updatedProduct = await this.productUseCase.updateProduct(Number(id), {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        imageUrl,
        categoryId: categoryId ? Number(categoryId) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined
      });
      
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      
      // Handle specific domain errors
      if (error instanceof Error) {
        if (error.message.includes('Category with ID')) {
          return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('Product name') || error.message.includes('Product price')) {
          return res.status(400).json({ error: error.message });
        }
      }
      
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Delete a product
   */
  deleteProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const deleted = await this.productUseCase.deleteProduct(Number(id));
      
      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
