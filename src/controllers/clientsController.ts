import { Request, Response } from "express";
import { getDataSource } from "../lib/typeorm";
import { ClientEntity } from "../modules/clients/adapters/out/persistence/entities/Client.entity";

export const getAllClients = async (req: Request, res: Response) => {
  try {
    const dataSource = await getDataSource();
    const clientRepository = dataSource.getRepository(ClientEntity);
    const clients = await clientRepository.find();
    return res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dataSource = await getDataSource();
    const clientRepository = dataSource.getRepository(ClientEntity);
    const client = await clientRepository.findOne({
      where: { id: Number(id) },
    });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    return res.status(200).json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, cpf, email, phone } = req.body;

    if (!name || !cpf || !email) {
      return res.status(400).json({ error: "Name, CPF, and email are required" });
    }

    const dataSource = await getDataSource();
    const clientRepository = dataSource.getRepository(ClientEntity);

    const newClient = clientRepository.create({
      name,
      cpf,
      email,
    });

    const savedClient = await clientRepository.save(newClient);
    return res.status(201).json(savedClient);
  } catch (error) {
    console.error("Error creating client:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, cpf, email, phone } = req.body;

    const dataSource = await getDataSource();
    const clientRepository = dataSource.getRepository(ClientEntity);

    const existingClient = await clientRepository.findOne({
      where: { id: Number(id) },
    });

    if (!existingClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Update fields
    if (name !== undefined) existingClient.name = name;
    if (cpf !== undefined) existingClient.cpf = cpf;
    if (email !== undefined) existingClient.email = email;

    const updatedClient = await clientRepository.save(existingClient);
    return res.status(200).json(updatedClient);
  } catch (error) {
    console.error("Error updating client:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const dataSource = await getDataSource();
    const clientRepository = dataSource.getRepository(ClientEntity);

    const existingClient = await clientRepository.findOne({
      where: { id: Number(id) },
    });

    if (!existingClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    await clientRepository.remove(existingClient);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting client:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};