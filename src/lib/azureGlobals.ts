import { CosmosClient } from "@azure/cosmos";
import { BlobServiceClient } from "@azure/storage-blob";

const storageAccountName: string =
  (import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME as string) ||
  "linksupstorage";

const sasToken: string =
  (import.meta.env.VITE_AZURE_STORAGE_SAS_TOKEN as string) ||
  "sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-12-11T10:45:17Z&st=2024-12-02T02:45:17Z&spr=https,http&sig=lLbKMKqxbYG%2B0IxUJFYU3pV8GYAdSOU3BCEJ57nexRQ%3D";
export const storageConfig = {
  accountName: storageAccountName,
  sasToken: sasToken,
};

export const blobServiceClient = new BlobServiceClient(
  `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
);

export const cosmosClient = new CosmosClient({
  endpoint: "https://linksupdb.documents.azure.com:443/",
  key: "vWkWvvVNrzmTTXLPMBlIsz4e6iK0MNmBh1gpmQj5Lr1NkfeBMUtPgEFEWw2lPVtHwXlqFkNz9nd9ACDbxsD42w==",
});
export const databaseId = "linksupdb-sql";
export const containerId = "uploads";

export const apiUrl =
  (import.meta.env.VITE_AZURE_API_URL as string) ||
  "https://linksup-api-container.wonderfulwater-3a18bfc4.westus.azurecontainerapps.io/";
