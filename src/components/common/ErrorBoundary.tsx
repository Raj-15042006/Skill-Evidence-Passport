import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Runtime Error in Skills Evidence Passport:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center font-body">
          <div className="bg-surface p-8 rounded-3xl border border-rose-200 shadow-2xl max-w-md w-full space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <h2 className="font-headline font-bold text-lg text-slate-900">
              Something went wrong
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              An unexpected UI error occurred. Don't worry, your cryptographic audit ledger data is completely safe.
            </p>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl font-mono text-[11px] text-rose-900 text-left overflow-x-auto">
              {this.state.error?.toString() || 'Unknown Runtime Exception'}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-hover shadow-sm"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
