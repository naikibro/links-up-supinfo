# Links Up !

The solution for Social Media content management

## 1 - Prerequisites

You must have installed:

- node > 18
- nvm
- azure CLI

We recommend using Vscode with the following [profile](https://vscode.dev/profile/github/96e043b8f6390951c3813a7227ac4043)

Login to your Azure portal

```sh
az login
```

Create the ressource group for your Azure cloud architecture

```sh
az group create --name linksup-resources --location westus
```

Create the storage account for your Azure cloud architecture

```sh
az storage account create \
    --name linksupstorage \
    --resource-group linksup-resources \
    --location westus \
    --sku Standard_LRS \
    --kind StorageV2
```

### /!\ Ensure you have your .env file complete /!\

```sh
cp .env.example .env
```

Then make sure to use provide the right values for each secret
To know more about the secrets we use, please contact [development team](mailto:naikibro@gmail.com)

Retrieve the connection string for your storage account:

```sh
az storage account show-connection-string \
    --name linksupstorage \
    --resource-group linksup-resources \
    --output tsv
```

This will return the connection string, which looks like:

```sh
DefaultEndpointsProtocol=https;AccountName=linksupstorage;AccountKey=<key-value>;EndpointSuffix=core.windows.net
```

Add the connection string to your [.env](.env) file:

```sh
STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=linksupstorage;AccountKey=<key-value>;EndpointSuffix=core.windows.net
```

## 2 - Run the project locally

### Setup the cloud architecture

Make sure you meet all the prerequisites

use the convenience script to deploy the Azure Cloud Architecture for `Links Up`

```sh
./deploy.sh   # should be idempotent, as it uses ARM template
```

### Run the frontend

```sh
npm install && npm run dev
```

## 3 - Deployment

To automatize the deployment we recommend using Azure Github actions  
synchronize your Azure web app with [this github](https://github.com/naikibro/tahiti-regenerative-travel) repository

```sh
az webapp deployment source config \
    --name linksup-webapp \
    --resource-group linksup-resources \
    --repo-url https://github.com/naikibro/tahiti-regenerative-travel \
    --branch main \
    --manual-integration
```

## 4 - Architecture overview

```
+----------------------------+
|     Links Up Frontend      |
|    (React + TypeScript)    |
+------------+---------------+
             |
             v
+----------------------------+
|     Azure Web App         |
| (Frontend Hosting Layer)  |
+------------+---------------+
             |
             v
+----------------------------+
|   Azure Storage Account   |
| (Blob storage for assets) |
+----------------------------+

```
