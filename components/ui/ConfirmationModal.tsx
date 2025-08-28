import React from 'react';
import Card from './Card';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = 'danger'
}) => {
  const iconBgClass = variant === 'danger' ? 'bg-red-900' : 'bg-primary/20';
  const iconClass = variant === 'danger' ? 'text-red-400' : 'text-primary';
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onCancel}>
      <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="sm:flex sm:items-start">
            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${iconBgClass} sm:mx-0 sm:h-10 sm:w-10`}>
                <AlertTriangle className={`h-6 w-6 ${iconClass}`} aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-100">{title}</h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-400">{message}</p>
                </div>
            </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
          <Button variant={variant} onClick={onConfirm}>
            {confirmText}
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            {cancelText}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmationModal;