import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-burgundy-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          className={`relative transform overflow-hidden rounded-3xl bg-white dark:bg-[#20050B] text-left shadow-2xl transition-all my-auto sm:my-8 w-full ${maxWidth} border-2 border-[#EAE0D3] dark:border-[#3F0E1B] p-4 sm:p-7 animate-in fade-in zoom-in-95 duration-200`}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-[#EAE0D3] dark:border-[#3F0E1B] mb-4 sm:mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#24050D] dark:text-[#FFFDF9]">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs font-semibold text-[#614D3C] dark:text-[#B59D85] mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 sm:p-2 text-[#B59D85] hover:text-[#801E35] dark:hover:text-[#FFFDF9] hover:bg-[#F6F1EA] dark:hover:bg-[#380C16] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="max-h-[80vh] overflow-y-auto pr-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
