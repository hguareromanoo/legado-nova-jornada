
import React from 'react';
import { Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface DocumentStatusIconProps {
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
}

const DocumentStatusIcon: React.FC<DocumentStatusIconProps> = ({ status }) => {
  switch (status) {
    case 'uploaded': 
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'uploading': 
      return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
    case 'error': 
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    default: 
      return <Upload className="w-5 h-5 text-gray-400" />;
  }
};

export default DocumentStatusIcon;
