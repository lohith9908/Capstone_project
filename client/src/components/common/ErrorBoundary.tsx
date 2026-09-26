import { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
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
    console.error('[ARES ErrorBoundary caught an error]:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050816] text-slate-100 flex items-center justify-center p-6 select-none">
          <div className="max-w-lg w-full bg-[#0B1220] border border-[#1E293B] rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wider font-mono text-white flex items-center gap-2">
                  <span>ARES</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    APPLICATION ERROR
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Automated Robustness Evaluation System
                </p>
              </div>
            </div>

            <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4 font-mono text-xs text-red-300 overflow-x-auto whitespace-pre-wrap">
              {this.state.error?.message || 'An unexpected application runtime exception occurred.'}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={this.handleRetry}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors font-mono"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors font-mono border border-slate-700"
              >
                <Home className="w-4 h-4" />
                <span>Return to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
