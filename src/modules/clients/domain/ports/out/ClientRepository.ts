import { Client, ClientDTO } from "../../entities/Client";

/**
 * ClientRepository Interface (Output Port)
 *
 * This interface defines the operations for persisting and retrieving clients.
 * It serves as the secondary output port for the hexagonal architecture.
 * Adapters will implement this interface to provide actual data access.
 */
export interface ClientRepository {
  /**
   * Find all clients
   * @returns Promise resolving to an array of ClientDTO objects
   */
  findAll(): Promise<ClientDTO[]>;

  /**
   * Find a client by its ID
   * @param id The ID of the client to find
   * @returns Promise resolving to a ClientDTO or null if not found
   */
  findById(id: number): Promise<ClientDTO | null>;

  /**
   * Save a new client
   * @param client The client entity to save
   * @returns Promise resolving to the saved ClientDTO with generated ID
   */
  save(client: Client): Promise<ClientDTO>;

  /**
   * Update an existing client
   * @param client The client entity to update
   * @returns Promise resolving to the updated ClientDTO or null if not found
   */
  update(client: Client): Promise<ClientDTO | null>;

  /**
   * Delete a client by its ID
   * @param id The ID of the client to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  delete(id: number): Promise<boolean>;

  /**
   * Find a client by their CPF
   * @param cpf The CPF of the client to find
   * @returns Promise resolving to a ClientDTO or null if not found
   */
  findByCPF(cpf: string): Promise<ClientDTO | null>;

  /**
   * Find a client by their email
   * @param email The email of the client to find
   * @returns Promise resolving to a ClientDTO or null if not found
   */
  findByEmail(email: string): Promise<ClientDTO | null>;
}
