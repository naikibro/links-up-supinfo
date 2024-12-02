import { BlobServiceClient } from "@azure/storage-blob";
import React, { useState } from "react";
import { storageConfig } from "../../lib/azureGlobals";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const blobServiceClient = new BlobServiceClient(
    `https://${storageConfig.accountName}.blob.core.windows.net/?${storageConfig.sasToken}`
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    try {
      const containerName = "files";
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const uploadedFileName = `${timestamp}_${file.name}`;

      await containerClient.createIfNotExists();
      const blobClient = containerClient.getBlockBlobClient(uploadedFileName);
      const fileArrayBuffer = await file.arrayBuffer();
      await blobClient.uploadData(fileArrayBuffer, {
        blobHTTPHeaders: { blobContentType: file.type },
      });

      const blobUrl = blobClient.url;
      setMessage(`File uploaded successfully. URL: ${blobUrl}`);
    } catch (error) {
      setMessage(`Upload failed: ${error}`);
    }
  };

  return (
    <div>
      <h1>File Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
