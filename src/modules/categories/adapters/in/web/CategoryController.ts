import { Request, Response } from 'express';
import { CategoryUseCase } from '../../../domain/ports/in/CategoryUseCase';

/**
 * CategoryController
 * 
 * This controller serves as an input adapter for the web interface.
 * It translates HTTP requests into calls to the CategoryUseCase (input port).
 */
export class CategoryController {
  private categoryUseCase: CategoryUseCase;

  constructor(categoryUseCase: CategoryUseCase) {
    this.categoryUseCase = categoryUseCase;
  }

  /**
   * Get all categories
   */
  getAllCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryUseCase.getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get a category by ID
   */
  getCategoryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await this.categoryUseCase.getCategoryById(Number(id));
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      return res.status(200).json(category);
    } catch (error) {
      console.error('Error fetching category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Create a new category
   */
  createCategory = async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      
      const newCategory = await this.categoryUseCase.createCategory({
        name,
        description
      });
      
      return res.status(201).json(newCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      
      // Handle specific domain errors
      if (error instanceof Error) {
        if (error.message.includes('Category name')) {
          return res.status(400).json({ error: error.message });
        }
      }
      
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Update an existing category
   */
  updateCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      
      const updatedCategory = await this.categoryUseCase.updateCategory(Number(id), {
        name,
        description
      });
      
      if (!updatedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      return res.status(200).json(updatedCategory);
    } catch (error) {
      console.error('Error updating category:', error);
      
      // Handle specific domain errors
      if (error instanceof Error) {
        if (error.message.includes('Category name')) {
          return res.status(400).json({ error: error.message });
        }
      }
      
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Delete a category
   */
  deleteCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const deleted = await this.categoryUseCase.deleteCategory(Number(id));
      
      if (!deleted) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting category:', error);
      
      // Handle specific domain errors
      if (error instanceof Error) {
        if (error.message.includes('Cannot delete category with associated products')) {
          return res.status(400).json({ error: error.message });
        }
      }
      
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
