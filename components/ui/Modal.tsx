import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  children: ReactNode;
  title?: string;
  description?: string;
  onClose?: () => void;
  closable?: boolean;
  scoped?: boolean;
}

export function Modal({
  open,
  children,
  title,
  description,
  onClose,
  closable = false,
  scoped = false,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className={`${scoped ? "absolute" : "fixed"} inset-0 z-50 flex items-center justify-center p-4`}
    >
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={closable ? onClose : undefined}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        {(title || closable) && (
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-slate-500">{description}</p>
              )}
            </div>
            {closable && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
