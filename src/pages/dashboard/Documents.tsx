
import React, { useState } from 'react';
import { Folder, File, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DocumentUploadModal from '@/components/documents/DocumentUploadModal';
import DocumentGrid from '@/components/documents/DocumentGrid';
import DocumentDirectoryTree from '@/components/documents/DocumentDirectoryTree';
import { useToast } from '@/hooks/use-toast';

// Document types
export type DocumentType = 
  | 'identification' 
  | 'financial' 
  | 'legal' 
  | 'property' 
  | 'investment' 
  | 'insurance' 
  | 'other';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  path: string;
  directory: string;
  createdAt: Date;
  size?: string;
  lastModified?: Date;
}

export interface Directory {
  id: string;
  name: string;
  documents: Document[];
  subDirectories?: Directory[];
}

const Documents = () => {
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDirectory, setCurrentDirectory] = useState<string>('root');
  const { toast } = useToast();

  // Mock initial directories and documents
  const [directories, setDirectories] = useState<Directory[]>([
    {
      id: 'personal-docs',
      name: 'Documentos Pessoais',
      documents: [
        {
          id: 'doc-1',
          name: 'RG.pdf',
          type: 'identification',
          path: '/documents/personal/RG.pdf',
          directory: 'personal-docs',
          createdAt: new Date('2024-03-15'),
          size: '1.2 MB'
        },
        {
          id: 'doc-2',
          name: 'CPF.pdf',
          type: 'identification',
          path: '/documents/personal/CPF.pdf',
          directory: 'personal-docs',
          createdAt: new Date('2024-03-15'),
          size: '0.8 MB'
        }
      ]
    },
    {
      id: 'financial-docs',
      name: 'Documentos Financeiros',
      documents: [
        {
          id: 'doc-3',
          name: 'Extrato Bancário Abril.pdf',
          type: 'financial',
          path: '/documents/financial/extrato-abril.pdf',
          directory: 'financial-docs',
          createdAt: new Date('2024-04-10'),
          size: '2.4 MB'
        }
      ]
    },
    {
      id: 'property-docs',
      name: 'Imóveis',
      documents: [
        {
          id: 'doc-4',
          name: 'Escritura Apartamento.pdf',
          type: 'property',
          path: '/documents/property/escritura-apto.pdf',
          directory: 'property-docs',
          createdAt: new Date('2024-02-22'),
          size: '3.7 MB'
        }
      ]
    }
  ]);

  const addNewDocument = (document: Omit<Document, 'id' | 'createdAt'>) => {
    const newDoc: Document = {
      ...document,
      id: `doc-${Date.now()}`,
      createdAt: new Date()
    };

    setDirectories(prevDirectories => 
      prevDirectories.map(dir => {
        if (dir.id === document.directory) {
          return {
            ...dir,
            documents: [...dir.documents, newDoc]
          };
        }
        return dir;
      })
    );

    toast({
      title: "Documento adicionado",
      description: `${newDoc.name} foi adicionado com sucesso.`,
    });
    
    setIsAddDocumentOpen(false);
  };

  const addNewDirectory = (directoryName: string) => {
    if (directoryName.trim() === '') return;
    
    const newDir: Directory = {
      id: `dir-${Date.now()}`,
      name: directoryName,
      documents: []
    };
    
    setDirectories(prev => [...prev, newDir]);
    
    toast({
      title: "Pasta criada",
      description: `${directoryName} foi criada com sucesso.`,
    });
  };

  // Filter documents based on search query
  const filteredDirectories = directories.map(dir => ({
    ...dir,
    documents: dir.documents.filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(dir => 
    dir.name.toLowerCase().includes(searchQuery.toLowerCase()) || dir.documents.length > 0
  );

  // Get current directory documents
  const currentDocs = currentDirectory === 'root'
    ? filteredDirectories.flatMap(dir => dir.documents)
    : filteredDirectories.find(dir => dir.id === currentDirectory)?.documents || [];

  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-400">
          Gerencie todos os documentos relacionados à sua holding, incluindo contratos, escrituras, e mais.
        </p>
      </div>
        
      <div className="flex flex-col md:flex-row gap-6">
        {/* Directory sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-gray-800 rounded-lg p-4 h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Pastas</h2>
              <Button 
                onClick={() => {
                  const name = prompt('Nome da nova pasta:');
                  if (name) addNewDirectory(name);
                }} 
                variant="ghost" 
                size="sm"
              >
                <Plus size={16} />
              </Button>
            </div>
            
            <DocumentDirectoryTree 
              directories={directories} 
              currentDirectory={currentDirectory}
              setCurrentDirectory={setCurrentDirectory}
            />
          </div>
        </div>
        
        {/* Main content */}
        <div className="w-full md:w-3/4">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full sm:w-96">
                <Input
                  placeholder="Buscar documentos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button onClick={() => setIsAddDocumentOpen(true)} variant="blue">
                <Plus size={16} className="mr-2" />
                Adicionar Documento
              </Button>
            </div>
            
            <DocumentGrid 
              documents={currentDocs}
              directories={directories}
            />
          </div>
        </div>
      </div>
      
      {/* Document upload modal */}
      <DocumentUploadModal
        isOpen={isAddDocumentOpen}
        onClose={() => setIsAddDocumentOpen(false)}
        onSave={addNewDocument}
        directories={directories}
      />
    </div>
  );
};

export default Documents;
