import { ClientDTO } from "../../entities/Client";

/**
 * ClientUseCase Interface (Input Port)
 *
 * This interface defines the use cases for managing clients.
 * It serves as the primary input port for the hexagonal architecture.
 * Adapters (e.g., controllers) will call these methods to execute business logic.
 */
export interface ClientUseCase {
  /**
   * Retrieve all clients
   * @returns Promise resolving to an array of ClientDTO objects
   */
  getAllClients(): Promise<ClientDTO[]>;

  /**
   * Retrieve a client by their ID
   * @param id The ID of the client to retrieve
   * @returns Promise resolving to a ClientDTO or null if not found
   */
  getClientById(id: number): Promise<ClientDTO | null>;

  /**
   * Create a new client
   * @param clientData The data for the new client
   * @returns Promise resolving to the created ClientDTO
   */
  createClient(
    clientData: Omit<ClientDTO, "id" | "createdAt" | "updatedAt">
  ): Promise<ClientDTO>;

  /**
   * Update an existing client
   * @param id The ID of the client to update
   * @param clientData The updated data for the client
   * @returns Promise resolving to the updated ClientDTO or null if not found
   */
  updateClient(
    id: number,
    clientData: Partial<Omit<ClientDTO, "id" | "createdAt" | "updatedAt">>
  ): Promise<ClientDTO | null>;

  /**
   * Delete a client by their ID
   * @param id The ID of the client to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  deleteClient(id: number): Promise<boolean>;

  /**
   * Retrieve a client by their CPF
   * @param cpf The CPF of the client to retrieve
   * @returns Promise resolving to a ClientDTO or null if not found
   */
  getClientByCPF(cpf: string): Promise<ClientDTO | null>;

  /**
   * Retrieve a client by their email
   * @param email The email of the client to retrieve
   * @returns Promise resolving to a ClientDTO or null if not found
   */
  getClientByEmail(email: string): Promise<ClientDTO | null>;
}
