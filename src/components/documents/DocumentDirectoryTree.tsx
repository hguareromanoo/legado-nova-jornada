
import React from 'react';
import { Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { Directory } from '@/pages/Documents';
import { cn } from '@/lib/utils';

interface DocumentDirectoryTreeProps {
  directories: Directory[];
  currentDirectory: string;
  setCurrentDirectory: (id: string) => void;
}

const DocumentDirectoryTree: React.FC<DocumentDirectoryTreeProps> = ({ 
  directories, 
  currentDirectory, 
  setCurrentDirectory 
}) => {
  return (
    <div className="space-y-1">
      <div 
        className={cn(
          "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-700 transition-colors",
          currentDirectory === 'root' && "bg-gray-700 font-medium"
        )}
        onClick={() => setCurrentDirectory('root')}
      >
        <Folder size={18} className="text-blue-400" />
        <span>Todos os Documentos</span>
      </div>
      
      {directories.map((directory) => (
        <div key={directory.id} className="ml-2">
          <div 
            className={cn(
              "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-700 transition-colors",
              currentDirectory === directory.id && "bg-gray-700 font-medium"
            )}
            onClick={() => setCurrentDirectory(directory.id)}
          >
            <Folder size={18} className="text-yellow-400" />
            <span className="truncate">{directory.name}</span>
            <span className="text-gray-400 text-xs ml-auto">
              {directory.documents.length}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentDirectoryTree;
