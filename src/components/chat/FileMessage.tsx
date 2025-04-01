
import React from 'react';
import { FileText, Download } from 'lucide-react';

interface FileMessageProps {
  filename: string;
}

const FileMessage: React.FC<FileMessageProps> = ({ filename }) => {
  // In a real app, this would include the actual file URL
  const handleDownload = () => {
    // Demo only - would implement actual download in production
    console.log(`Downloading file: ${filename}`);
    alert(`In a real app, this would download: ${filename}`);
  };
  
  return (
    <div className="chat-file-attachment" onClick={handleDownload}>
      <FileText className="h-5 w-5 text-blue-500" />
      <span className="flex-1 truncate">{filename}</span>
      <Download className="h-4 w-4 text-gray-500" />
    </div>
  );
};

export default FileMessage;
