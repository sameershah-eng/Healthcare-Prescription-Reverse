import React, { Component, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Mushonga Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F5F0] text-stone-900 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-16 h-16 rounded-3xl bg-[#D9673A] text-white flex items-center justify-center font-bold text-2xl shadow-lg mb-4">
            M
          </div>
          <h1 className="font-fraunces text-2xl font-bold text-stone-900 mb-2">
            Mushonga Healthcare
          </h1>
          <p className="text-xs text-stone-600 mb-4 max-w-md">
            The application encountered a display hiccup. Tap below to reload.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-3 rounded-2xl bg-[#0F3B34] text-white font-bold text-xs shadow-md hover:bg-[#165349]"
          >
            Reload Mushonga Prototype
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
