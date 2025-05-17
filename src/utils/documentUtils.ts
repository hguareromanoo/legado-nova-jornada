
import { DocumentType } from '@/pages/Documents';

export const getDocumentTypeLabel = (type: DocumentType): string => {
  const types = {
    identification: 'Documentos de Identificação',
    financial: 'Documentos Financeiros',
    legal: 'Documentos Legais',
    property: 'Documentos de Imóveis',
    investment: 'Documentos de Investimentos',
    insurance: 'Documentos de Seguros',
    other: 'Outros'
  };

  return types[type];
};

export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

export const isImageFile = (fileName: string): boolean => {
  const ext = getFileExtension(fileName);
  return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext);
};

export const isPdfFile = (fileName: string): boolean => {
  const ext = getFileExtension(fileName);
  return ext === 'pdf';
};

export const isDocFile = (fileName: string): boolean => {
  const ext = getFileExtension(fileName);
  return ['doc', 'docx'].includes(ext);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
