import { Client, ClientDTO } from "../../domain/entities/Client";
import { ClientRepository } from "../../domain/ports/out/ClientRepository";
import { ClientUseCase } from "../../domain/ports/in/ClientUseCase";

/**
 * ClientService
 *
 * This service implements the ClientUseCase interface and provides
 * the business logic for managing clients.
 */
export class ClientService implements ClientUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async getAllClients(): Promise<ClientDTO[]> {
    return this.clientRepository.findAll();
  }

  async getClientById(id: number): Promise<ClientDTO | null> {
    return this.clientRepository.findById(id);
  }

  async createClient(
    clientData: Omit<ClientDTO, "id" | "createdAt" | "updatedAt">
  ): Promise<ClientDTO> {
    const client = new Client(
      null,
      clientData.name,
      clientData.cpf,
      clientData.email,
    );
    return this.clientRepository.save(client);
  }

  async updateClient(
    id: number,
    clientData: Partial<Omit<ClientDTO, "id" | "createdAt" | "updatedAt">>
  ): Promise<ClientDTO | null> {
    const existingClientDTO = await this.clientRepository.findById(id);
    if (!existingClientDTO) {
      return null;
    }

    const existingClient = Client.fromDTO(existingClientDTO);

    if (clientData.name) {
      existingClient.updateName(clientData.name);
    }
    if (clientData.cpf) {
      existingClient.updateCPF(clientData.cpf);
    }
    if (clientData.email) {
      existingClient.updateEmail(clientData.email);
    }
    return this.clientRepository.update(existingClient);
  }

  async deleteClient(id: number): Promise<boolean> {
    return this.clientRepository.delete(id);
  }

  async getClientByCPF(cpf: string): Promise<ClientDTO | null> {
    return this.clientRepository.findByCPF(cpf);
  }

  async getClientByEmail(email: string): Promise<ClientDTO | null> {
    return this.clientRepository.findByEmail(email);
  }
}
