import { Box, List, ListItem } from "@mui/material";
import React from "react";
import { FileRecord } from "../../models/FileRecord";

interface AnonymousPublicFilesProps {
  files: FileRecord[];
}

const AnonymousPublicFiles: React.FC<AnonymousPublicFilesProps> = ({
  files,
}) => {
  const limitedFiles = [...files]
    .filter((file) => {
      const fileType = file.type.split("/")[0];
      return fileType === "image" || fileType === "video"; // Include only images and videos
    })
    .sort(() => Math.random() - 0.5)
    .slice(0, 15);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        pb: 4, // Padding for the blur area
      }}
    >
      <List
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 2,
          padding: 0,
        }}
      >
        {limitedFiles.map((file) => {
          const fileType = file.type.split("/")[0];

          return (
            <ListItem
              key={file.id}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "8px",
                overflow: "hidden",
                padding: 0,
                listStyle: "none",
              }}
            >
              {fileType === "image" ? (
                <Box
                  component="img"
                  src={file.url}
                  alt={file.fileName}
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  component="video"
                  src={file.url}
                  autoPlay
                  loop
                  muted
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
              )}
            </ListItem>
          );
        })}
      </List>
      {/* Blur effect */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: `linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 1) 100%)`,
          pointerEvents: "none",
        }}
      />
    </Box>
  );
};

export default AnonymousPublicFiles;
