/**
 * Category Entity
 * 
 * This is a domain entity that represents a category in our system.
 * It contains the core business logic and validation rules for categories.
 */
export class Category {
  private _id: number | null;
  private _name: string;
  private _description: string | null;

  constructor(
    id: number | null,
    name: string,
    description: string | null
  ) {
    // Validate inputs
    if (name.trim().length === 0) {
      throw new Error('Category name cannot be empty');
    }

    this._id = id;
    this._name = name;
    this._description = description;
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

  // Business methods
  updateName(name: string): void {
    if (name.trim().length === 0) {
      throw new Error('Category name cannot be empty');
    }
    this._name = name;
  }

  updateDescription(description: string | null): void {
    this._description = description;
  }

  // Convert to data transfer object
  toDTO(): CategoryDTO {
    return {
      id: this._id,
      name: this._name,
      description: this._description
    };
  }

  // Create from data transfer object
  static fromDTO(dto: CategoryDTO): Category {
    return new Category(
      dto.id,
      dto.name,
      dto.description
    );
  }
}

// Data Transfer Object interface
export interface CategoryDTO {
  id: number | null;
  name: string;
  description: string | null;
}
