import { DataSource } from "typeorm";
import { ClientEntity } from "../../modules/clients/adapters/out/persistence/entities/Client.entity";

/**
 * Seed initial clients into the database
 * @param dataSource TypeORM DataSource
 */
export const seedClients = async (dataSource: DataSource): Promise<void> => {
  const clientRepository = dataSource.getRepository(ClientEntity);

  // Check if clients already exist
  const count = await clientRepository.count();
  if (count > 0) {
    console.log("Clients already seeded, skipping...");
    return;
  }

  // Initial clients
  const clients = [
    {
      name: "John Doe",
      cpf: "12345678901",
      email: "john.doe@example.com",
    },
    {
      name: "Jane Smith",
      cpf: "98765432100",
      email: "jane.smith@example.com",
    },
    {
      name: "Alice Johnson",
      cpf: "11122233344",
      email: "alice.johnson@example.com",
    },
  ];

  // Insert clients
  await clientRepository.insert(clients);
  console.log(`Seeded ${clients.length} clients successfully`);
};
