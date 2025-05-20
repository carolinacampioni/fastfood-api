/**
 * Client Entity
 *
 * This is a domain entity that represents a client in our system.
 * It contains the core business logic and validation rules for clients.
 */
export class Client {
  private _id: number | null;
  private _name: string;
  private _cpf: string;
  private _email: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: number | null,
    name: string,
    cpf: string,
    email: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    // Validate inputs
    if (name.trim().length === 0) {
      throw new Error("Client name cannot be empty");
    }

    if (!this.isValidCPF(cpf)) {
      throw new Error("Invalid CPF");
    }

    if (!this.isValidEmail(email)) {
      throw new Error("Invalid email address");
    }

    this._id = id;
    this._name = name;
    this._cpf = cpf;
    this._email = email;
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

  get cpf(): string {
    return this._cpf;
  }

  get email(): string {
    return this._email;
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
      throw new Error("Client name cannot be empty");
    }
    this._name = name;
    this._updatedAt = new Date();
  }

  updateCPF(cpf: string): void {
    if (!this.isValidCPF(cpf)) {
      throw new Error("Invalid CPF");
    }
    this._cpf = cpf;
    this._updatedAt = new Date();
  }

  updateEmail(email: string): void {
    if (!this.isValidEmail(email)) {
      throw new Error("Invalid email address");
    }
    this._email = email;
    this._updatedAt = new Date();
  }

  // Validation methods
  private isValidCPF(cpf: string): boolean {
    // Add CPF validation logic here
    return cpf.length === 11 && /^\d+$/.test(cpf);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Convert to data transfer object
  toDTO(): ClientDTO {
    return {
      id: this._id,
      name: this._name,
      cpf: this._cpf,
      email: this._email,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  // Create from data transfer object
  static fromDTO(dto: ClientDTO): Client {
    return new Client(
      dto.id,
      dto.name,
      dto.cpf,
      dto.email,
      dto.createdAt,
      dto.updatedAt
    );
  }
}

// Data Transfer Object interface
export interface ClientDTO {
  id: number | null;
  name: string;
  cpf: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
