import { CosmosClient } from "@azure/cosmos";
import { BlobServiceClient } from "@azure/storage-blob";

export const storageConfig = {
  accountName: import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME as string,
  sasToken: import.meta.env.VITE_AZURE_STORAGE_SAS_TOKEN as string,
};

export const blobServiceClient = new BlobServiceClient(
  `https://${
    import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME
  }.blob.core.windows.net/?${import.meta.env.VITE_AZURE_STORAGE_SAS_TOKEN}`
);

export const cosmosClient = new CosmosClient({
  endpoint: "https://linksupdb.documents.azure.com:443/",
  key: "vWkWvvVNrzmTTXLPMBlIsz4e6iK0MNmBh1gpmQj5Lr1NkfeBMUtPgEFEWw2lPVtHwXlqFkNz9nd9ACDbxsD42w==",
});
export const databaseId = "linksupdb-sql";
export const containerId = "uploads";
