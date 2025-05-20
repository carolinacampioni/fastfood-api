import { ClientRepository } from "./domain/ports/out/ClientRepository";
import { ClientService } from "./application/services/ClientService";
import { ClientController } from "./adapters/in/web/ClientController";
import { TypeORMClientRepository } from "./adapters/out/persistence/TypeORMClientRepository";
import { DataSource } from "typeorm";
import { ClientEntity } from "./adapters/out/persistence/entities/Client.entity";

/**
 * ClientModule
 *
 * This module initializes and wires up all components for the Client domain.
 */
export class ClientModule {
  private clientRepository: ClientRepository;
  private clientService: ClientService;
  private clientController: ClientController;
  private initialized: boolean = false;

  constructor() {
    // Initialize repository
    this.clientRepository = new TypeORMClientRepository();

    // Initialize service
    this.clientService = new ClientService(this.clientRepository);

    // Initialize controller
    this.clientController = new ClientController(this.clientService);
  }

  /**
   * Initialize the module
   * This method should be called before using the module
   */
  async initialize(): Promise<void> {
    if (!this.initialized) {
      // Initialize the repository
      await (this.clientRepository as TypeORMClientRepository).initialize();
      this.initialized = true;
    }
  }

  /**
   * Get the ClientController instance
   * @returns ClientController
   */
  getController(): ClientController {
    return this.clientController;
  }
}
