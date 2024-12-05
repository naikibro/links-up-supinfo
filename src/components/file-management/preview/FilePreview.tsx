import { Typography, Modal, Box } from "@mui/material";
import { FileRecord } from "../../../models/FileRecord";

export const FilePreview: React.FC<{
  file: FileRecord | null;
  onClose: () => void;
}> = ({ file, onClose }) => {
  const renderPreview = () => {
    if (!file) return <Typography>No file to preview</Typography>;

    const fileType = file.type.split("/")[0];
    switch (fileType) {
      case "image":
        return (
          <img
            src={file.url}
            alt={file.fileName}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        );
      case "video":
        return <video src={file.url} controls style={{ maxWidth: "100%" }} />;
      case "audio":
        return <audio src={file.url} controls style={{ width: "100%" }} />;
      default:
        return (
          <Typography>
            File preview not supported.{" "}
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              Download file
            </a>{" "}
            instead.
          </Typography>
        );
    }
  };

  return (
    <Modal open={!!file} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Preview: {file?.fileName}
        </Typography>
        {file ? renderPreview() : <Typography>No file to preview</Typography>}
      </Box>
    </Modal>
  );
};
