#!/bin/bash

# Load environment variables from .env
export $(grep -v '^#' .env | xargs)

# Deploy resources with Azure CLI
echo "Starting Azure deployment..."

# Deploy the ARM template
az deployment group create \
    --resource-group linksup-resources \
    --template-file azuredeploy.json \
    --parameters \
      webAppName=$WEB_APP_NAME \
      functionAppName=$FUNCTION_APP_NAME \
      cosmosDbName=$COSMOS_DB_NAME \
      cosmosDbDatabaseName=$COSMOS_DB_DATABASE_NAME \
      cosmosDbCollectionName=$COSMOS_DB_COLLECTION_NAME \
      appServicePlanName=$APP_SERVICE_PLAN_NAME \
      storageAccountName=$STORAGE_ACCOUNT_NAME \
      location=$LOCATION \
      storageAccountConnectionString=$STORAGE_CONNECTION_STRING \
      googleClientId=$GOOGLE_CLIENT_ID \
      googleClientSecret=$GOOGLE_CLIENT_SECRET

echo "Azure deployment requested, see Azure portal for completion notification !"
