import { DataSource, Repository } from "typeorm";
import { ClientEntity } from "./entities/Client.entity";
import { ClientRepository } from "../../../domain/ports/out/ClientRepository";
import { Client, ClientDTO } from "../../../domain/entities/Client";
import { getDataSource } from "../../../../../lib/typeorm";

/**
 * TypeORMClientRepository
 *
 * This repository implements the ClientRepository interface using TypeORM.
 */
export class TypeORMClientRepository implements ClientRepository {
  private repository: Repository<ClientEntity> | null = null;

  constructor() {
    // Initialize repository - will be set in the initialize method
    this.repository = null;
  }

  /**
   * Initialize the repository
   * This method must be called before using the repository
   */
  async initialize(): Promise<void> {
    const dataSource = await getDataSource();
    this.repository = dataSource.getRepository(ClientEntity);
  }

  async findAll(): Promise<ClientDTO[]> {
    if (!this.repository) throw new Error("Repository not initialized");
    const clients = await this.repository.find();
    return clients.map((client) => this.toDTO(client));
  }

  async findById(id: number): Promise<ClientDTO | null> {
    if (!this.repository) throw new Error("Repository not initialized");
    const client = await this.repository.findOneBy({ id });
    return client ? this.toDTO(client) : null;
  }

  async save(client: Client): Promise<ClientDTO> {
    if (!this.repository) throw new Error("Repository not initialized");
    const clientEntity = this.toEntity(client);
    const savedClient = await this.repository.save(clientEntity);
    return this.toDTO(savedClient);
  }

  async update(client: Client): Promise<ClientDTO | null> {
    if (!this.repository) throw new Error("Repository not initialized");
    const clientEntity = this.toEntity(client);
    const existingClient = await this.repository.findOneBy({
      id: clientEntity.id,
    });
    if (!existingClient) {
      return null;
    }
    const updatedClient = await this.repository.save(clientEntity);
    return this.toDTO(updatedClient);
  }

  async delete(id: number): Promise<boolean> {
    if (!this.repository) throw new Error("Repository not initialized");
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async findByCPF(cpf: string): Promise<ClientDTO | null> {
    if (!this.repository) throw new Error("Repository not initialized");
    const client = await this.repository.findOneBy({ cpf });
    return client ? this.toDTO(client) : null;
  }

  async findByEmail(email: string): Promise<ClientDTO | null> {
    if (!this.repository) throw new Error("Repository not initialized");
    const client = await this.repository.findOneBy({ email });
    return client ? this.toDTO(client) : null;
  }

  /**
   * Converts a ClientEntity to a ClientDTO
   * @param entity The ClientEntity to convert
   * @returns The corresponding ClientDTO
   */
  private toDTO(entity: ClientEntity): ClientDTO {
    return {
      id: entity.id,
      name: entity.name,
      cpf: entity.cpf,
      email: entity.email,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Converts a Client domain entity to a ClientEntity
   * @param client The Client domain entity to convert
   * @returns The corresponding ClientEntity
   */
  private toEntity(client: Client): ClientEntity {
    const entity = new ClientEntity();
    entity.id = client.id || undefined; // TypeORM ignores undefined for auto-generated columns
    entity.name = client.name;
    entity.cpf = client.cpf;
    entity.email = client.email;
    entity.createdAt = client.createdAt;
    entity.updatedAt = client.updatedAt;
    return entity;
  }
}
