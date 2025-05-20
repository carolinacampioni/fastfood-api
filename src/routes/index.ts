import { Router, Request, Response } from "express";
import { CategoryModule } from "../modules/categories/CategoryModule";
import { ProductModule } from "../modules/products/ProductModule";
import { ClientModule } from "../modules/clients/ClientModule";

/**
 * Setup routes with initialized modules
 * @param categoryModule Initialized CategoryModule
 * @param productModule Initialized ProductModule
 * @param clientModule Initialized ClientModule
 * @returns Express router
 */
export default function setupRoutes(
  categoryModule: CategoryModule,
  productModule: ProductModule,
  clientModule: ClientModule
): Router {
  const router = Router();

  // Get controllers from initialized modules
  const categoryController = categoryModule.getController();
  const productController = productModule.getController();
  const clientController = clientModule.getController();

  // Health check route
  router.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "OK" });
  });

  // Category routes
  router.get(
    "/categories",
    categoryController.getAllCategories.bind(categoryController)
  );
  router.get(
    "/categories/:id",
    categoryController.getCategoryById.bind(categoryController)
  );
  router.post(
    "/categories",
    categoryController.createCategory.bind(categoryController)
  );
  router.put(
    "/categories/:id",
    categoryController.updateCategory.bind(categoryController)
  );
  router.delete(
    "/categories/:id",
    categoryController.deleteCategory.bind(categoryController)
  );

  // Product routes
  router.get(
    "/products",
    productController.getAllProducts.bind(productController)
  );
  router.get(
    "/products/:id",
    productController.getProductById.bind(productController)
  );
  router.get(
    "/products/category/:categoryId",
    productController.getProductsByCategory.bind(productController)
  );
  router.post(
    "/products",
    productController.createProduct.bind(productController)
  );
  router.put(
    "/products/:id",
    productController.updateProduct.bind(productController)
  );
  router.delete(
    "/products/:id",
    productController.deleteProduct.bind(productController)
  );

  // Client routes
  router.get("/clients", clientController.getAllClients.bind(clientController));
  router.get(
    "/clients/:id",
    clientController.getClientById.bind(clientController)
  );
  router.post("/clients", clientController.createClient.bind(clientController));
  router.put(
    "/clients/:id",
    clientController.updateClient.bind(clientController)
  );
  router.delete(
    "/clients/:id",
    clientController.deleteClient.bind(clientController)
  );
  router.get(
    "/clients/cpf/:cpf",
    clientController.getClientByCPF.bind(clientController)
  );
  router.get(
    "/clients/email/:email",
    clientController.getClientByEmail.bind(clientController)
  );

  return router;
}
