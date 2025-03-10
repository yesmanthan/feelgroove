
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface RecommendationsHeaderProps {
  onBack: () => void;
}

const RecommendationsHeader: React.FC<RecommendationsHeaderProps> = ({ onBack }) => {
  return (
    <header className="flex items-center justify-between mb-8">
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-1" 
        onClick={onBack}
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </Button>
      
      <h1 className="text-xl font-bold">FeelGroove</h1>
      
      <div className="w-24">
        {/* Placeholder for user menu or other actions */}
      </div>
    </header>
  );
};

export default RecommendationsHeader;
