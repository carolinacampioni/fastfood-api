import { Request, Response } from "express";
import { ClientUseCase } from "../../../domain/ports/in/ClientUseCase";

/**
 * ClientController
 *
 * This controller handles HTTP requests for the Client module
 * and delegates the business logic to the ClientUseCase.
 */
export class ClientController {
  constructor(private readonly clientUseCase: ClientUseCase) {}

  async getAllClients(req: Request, res: Response): Promise<void> {
    try {
      const clients = await this.clientUseCase.getAllClients();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve clients" });
    }
  }

  async getClientById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const client = await this.clientUseCase.getClientById(Number(id));
      if (!client) {
        res.status(404).json({ error: "Client not found" });
        return;
      }
      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve client" });
    }
  }

  async createClient(req: Request, res: Response): Promise<void> {
    try {
      const clientData = req.body;
      const newClient = await this.clientUseCase.createClient(clientData);
      res.status(201).json(newClient);
    } catch (error) {
      res.status(400).json({ error: "Failed to create client" });
    }
  }

  async updateClient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const clientData = req.body;
      const updatedClient = await this.clientUseCase.updateClient(
        Number(id),
        clientData
      );
      if (!updatedClient) {
        res.status(404).json({ error: "Client not found" });
        return;
      }
      res.status(200).json(updatedClient);
    } catch (error) {
      res.status(400).json({ error: "Failed to update client" });
    }
  }

  async deleteClient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.clientUseCase.deleteClient(Number(id));
      if (!deleted) {
        res.status(404).json({ error: "Client not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete client" });
    }
  }

  async getClientByCPF(req: Request, res: Response): Promise<void> {
    try {
      const { cpf } = req.params;
      const client = await this.clientUseCase.getClientByCPF(cpf);
      if (!client) {
        res.status(404).json({ error: "Client not found" });
        return;
      }
      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve client by CPF" });
    }
  }

  async getClientByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const client = await this.clientUseCase.getClientByEmail(email);
      if (!client) {
        res.status(404).json({ error: "Client not found" });
        return;
      }
      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve client by email" });
    }
  }
}
