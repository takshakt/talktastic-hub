
import React from 'react';
import { Button } from '@/components/ui/button';
import { Button as ButtonType } from '@/services/chatService';

interface ButtonsMessageProps {
  buttons: ButtonType[];
  onButtonClick: (value: string, action?: string) => void;
}

const ButtonsMessage: React.FC<ButtonsMessageProps> = ({ buttons, onButtonClick }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="rounded-full transition-all border-emerald-700/40 bg-dark-700/40 hover:bg-emerald-600 hover:text-white hover:border-transparent"
          onClick={() => onButtonClick(button.value, button.action)}
        >
          {button.text}
        </Button>
      ))}
    </div>
  );
};

export default ButtonsMessage;
