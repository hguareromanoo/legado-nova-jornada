import React from 'react';
import { File, FileText, FileImage, FileType } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Document, Directory } from '@/pages/Documents';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface DocumentGridProps {
  documents: Document[];
  directories: Directory[];
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ documents, directories }) => {
  const getDocumentIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
      return <FileImage className="text-green-400" size={40} />;
    } else if (extension === 'pdf') {
      return <FileType className="text-red-400" size={40} />; // Changed from FilePdf to FileType
    } else {
      return <FileText className="text-blue-400" size={40} />;
    }
  };
  const getDirectoryName = (directoryId: string): string => {
    const directory = directories.find(dir => dir.id === directoryId);
    return directory?.name || 'Indefinido';
  };

  if (documents.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-400">
        <File size={48} className="mb-4 opacity-30" />
        <p>Nenhum documento encontrado</p>
        <p className="text-sm">Adicione documentos ou altere sua busca</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map(document => (
        <div 
          key={document.id} 
          className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors border border-gray-600"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {getDocumentIcon(document.name)}
              <div>
                <h3 className="font-medium text-white">{document.name}</h3>
                <p className="text-xs text-gray-400">{getDirectoryName(document.directory)}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                <DropdownMenuItem className="text-gray-200 hover:text-white">
                  Visualizar
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-200 hover:text-white">
                  Baixar
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400 hover:text-red-300">
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="text-xs text-gray-400 mt-4 flex items-center justify-between">
            <div>
              {document.size && (
                <span className="inline-block mr-3">{document.size}</span>
              )}
              <span>
                {format(new Date(document.createdAt), "d 'de' MMMM, yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentGrid;
