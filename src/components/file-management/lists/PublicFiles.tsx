import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { FileRecord } from "../../../models/FileRecord";
import FilesList from "./FilesList";
import FilesGallery from "./FilesGallery";

interface PublicFilesProps {
  files: FileRecord[];
  onPreview: (file: FileRecord) => void;
}

const PublicFiles: React.FC<PublicFilesProps> = ({ files, onPreview }) => {
  const [activeTab, setActiveTab] = useState<"list" | "gallery">("list");

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: "list" | "gallery"
  ) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      {/* Tabs for Display Mode */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="List View" value="list" />
        <Tab label="Gallery View" value="gallery" />
      </Tabs>

      {/* Conditional Rendering Based on Tab */}
      {activeTab === "list" ? (
        <FilesList files={files} onPreview={onPreview} />
      ) : (
        <FilesGallery files={files} />
      )}
    </Box>
  );
};

export default PublicFiles;
