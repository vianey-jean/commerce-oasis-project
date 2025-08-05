
import { toast } from 'sonner';
import { CheckCircle, XCircle } from 'lucide-react';

export const ModernToast = {
  success: (message: string) => {
    toast.success(message, {
      className: "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-2xl",
      style: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        border: 'none',
        color: 'white',
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      duration: 4000,
      icon: <CheckCircle className="w-5 h-5" />,
    });
  },
  
  error: (message: string) => {
    toast.error(message, {
      className: "bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-2xl",
      style: {
        background: 'linear-gradient(135deg, #ef4444, #e11d48)',
        border: 'none',
        color: 'white',
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      duration: 4000,
      icon: <XCircle className="w-5 h-5" />,
    });
  }
};
