
import React from 'react';
import { AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModelStatusProps {
  modelLoadingError: string | null;
  isModelLoading: boolean;
  openModelDownloadLink: () => void;
}

const ModelStatus: React.FC<ModelStatusProps> = ({
  modelLoadingError,
  isModelLoading,
  openModelDownloadLink
}) => {
  if (modelLoadingError) {
    return (
      <div className="bg-destructive/10 text-destructive rounded-md p-3 mb-4 flex items-start">
        <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">{modelLoadingError}</p>
          <p className="text-xs mt-1">
            You need to download the face detection models to the /public/models directory.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 text-xs flex items-center gap-1"
            onClick={openModelDownloadLink}
          >
            <Download size={14} />
            Download Models
          </Button>
        </div>
      </div>
    );
  }

  if (isModelLoading) {
    return (
      <div className="text-center py-4 mb-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading face detection models...</p>
      </div>
    );
  }

  return null;
};

export default ModelStatus;
