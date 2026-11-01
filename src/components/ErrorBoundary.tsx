import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, fallbackTitle }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (import.meta.env.DEV) {
        console.error('Captured window error in security boundary:', event.error);
      }
      setHasError(true);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (import.meta.env.DEV) {
        console.error('Unhandled promise rejection:', event.reason);
      }
      // Only set error boundary for critical render-blocking unhandled promise rejections
      if (event.reason && typeof event.reason === 'object' && event.reason.isFatal) {
        setHasError(true);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const handleReset = () => {
    setHasError(false);
    window.location.reload();
  };

  if (hasError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none bg-white">
        <div className="w-12 h-12 rounded-2xl bg-black text-[#c8f179] flex items-center justify-center mb-6 shadow-sm">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="inline-flex items-center gap-2 border border-[#c4c7c7] px-3.5 py-1 rounded-full bg-white mb-4 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#476800]" />
          <span className="font-mono-tech text-xs text-[#476800] uppercase font-bold tracking-wider">
            DIAGNOSTIC NOTICE // 500
          </span>
        </div>

        <h2 className="font-display-tech text-2xl sm:text-3xl font-extrabold text-[#000000] tracking-tight mb-3">
          {fallbackTitle || 'SYSTEM INTERACTION NOTICE'}
        </h2>

        <p className="font-display-tech text-sm text-[#444748] mb-8 leading-relaxed max-w-md">
          The studio application encountered an unexpected state. Security safeguards prevented further execution. Please refresh the module or return to the main console.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 bg-[#000000] text-[#c8f179] font-mono-tech font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#191c1b] transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RELOAD COMPONENT</span>
          </button>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/';
            }}
            className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-800 font-mono-tech font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-neutral-200 transition-all cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>MAIN CONSOLE</span>
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
