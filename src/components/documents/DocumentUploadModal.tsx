
import React, { useState, useRef } from 'react';
import { CheckCircle2, Upload, X, ChevronRight, ChevronLeft, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Document, Directory, DocumentType } from '@/pages/Documents';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (document: Omit<Document, 'id' | 'createdAt'>) => void;
  directories: Directory[];
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  directories
}) => {
  const [step, setStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('other');
  const [directoryId, setDirectoryId] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const resetState = () => {
    setStep(1);
    setUploadProgress(0);
    setSelectedFile(null);
    setDocumentName('');
    setDocumentType('other');
    setDirectoryId('');
    setUploadComplete(false);
  };
  
  const handleClose = () => {
    resetState();
    onClose();
  };
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setDocumentName(file.name);
      simulateUpload();
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setDocumentName(file.name);
      simulateUpload();
    }
  };
  
  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setUploadComplete(true);
        setTimeout(() => {
          setStep(2);
        }, 500);
      }
    }, 200);
  };
  
  const handleSubmit = () => {
    if (!selectedFile || !documentName || !documentType) return;
    
    const newDoc: Omit<Document, 'id' | 'createdAt'> = {
      name: documentName,
      type: documentType,
      path: `/documents/${directoryId}/${documentName}`,
      directory: directoryId || directories[0]?.id || '',
      size: formatFileSize(selectedFile.size),
      lastModified: new Date(selectedFile.lastModified)
    };
    
    onSave(newDoc);
    handleClose();
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };
  
  const documentTypes: { value: DocumentType; label: string }[] = [
    { value: 'identification', label: 'Documentos de Identificação' },
    { value: 'financial', label: 'Documentos Financeiros' },
    { value: 'legal', label: 'Documentos Legais' },
    { value: 'property', label: 'Documentos de Imóveis' },
    { value: 'investment', label: 'Documentos de Investimentos' },
    { value: 'insurance', label: 'Documentos de Seguros' },
    { value: 'other', label: 'Outros' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {step === 1 ? 'Carregar Documento' : 'Detalhes do Documento'}
          </DialogTitle>
        </DialogHeader>
        
        {/* Step indicators */}
        <div className="flex items-center justify-center mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 1 ? 'bg-blue-600' : 'bg-blue-600/40'
          } mr-2`}>
            1
          </div>
          <div className="h-1 w-8 bg-gray-600"></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 2 ? 'bg-blue-600' : 'bg-gray-600'
          }`}>
            2
          </div>
        </div>
        
        {/* Step 1: File Upload */}
        {step === 1 && (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {selectedFile && uploadProgress < 100 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-300">Carregando arquivo...</p>
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-gray-400">{uploadProgress}%</p>
                </div>
              ) : selectedFile && uploadComplete ? (
                <div className="space-y-4">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                  <p className="text-sm text-gray-300">Arquivo carregado com sucesso!</p>
                  <p className="text-xs text-gray-400">{selectedFile.name}</p>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-300">
                    Arraste e solte seu arquivo aqui ou
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="mt-2 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Selecione um arquivo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Formatos suportados: PDF, JPG, PNG, DOC, DOCX
                  </p>
                </>
              )}
            </div>
            
            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={handleClose}
                className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => selectedFile && uploadComplete && setStep(2)}
                disabled={!selectedFile || !uploadComplete}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Próximo
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </DialogFooter>
          </div>
        )}
        
        {/* Step 2: Document Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="document-name" className="text-sm font-medium text-gray-300">
                  Nome do Documento
                </label>
                <Input
                  id="document-name"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Ex: Contrato de Aluguel"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="document-type" className="text-sm font-medium text-gray-300">
                  Tipo de Documento
                </label>
                <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="document-directory" className="text-sm font-medium text-gray-300">
                  Pasta
                </label>
                <Select value={directoryId} onValueChange={setDirectoryId}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecione a pasta" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {directories.map((directory) => (
                      <SelectItem key={directory.id} value={directory.id} className="flex items-center">
                        <div className="flex items-center">
                          <Folder className="mr-2 h-4 w-4 text-yellow-400" />
                          {directory.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
              >
                <ChevronLeft size={16} className="mr-1" />
                Voltar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!documentName || !documentType || !directoryId}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Salvar Documento
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadModal;
