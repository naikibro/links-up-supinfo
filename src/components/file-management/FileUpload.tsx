import { BlobServiceClient } from "@azure/storage-blob";
import React, { useState } from "react";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const blobServiceClient = new BlobServiceClient(
    `https://linksupstorage.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-12-11T10:45:17Z&st=2024-12-02T02:45:17Z&spr=https,http&sig=lLbKMKqxbYG%2B0IxUJFYU3pV8GYAdSOU3BCEJ57nexRQ%3D`
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
      <a href="/.auth/login/github">Login</a>
      <h1>File Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
