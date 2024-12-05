export interface FileRecord {
  id: string;
  fileName: string;
  uploadedAt: string;
  url: string;
  author: string;
  type: string;
  isPublished?: boolean;
}
