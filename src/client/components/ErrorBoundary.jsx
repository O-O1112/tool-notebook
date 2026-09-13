import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      // 保留重要設定，僅清除當前空間狀態快取以利修復
      sessionStorage.clear();
    } catch (e) {
      console.error('Error clearing session:', e);
    }
    window.location.href = window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 notebook-grid-bg">
          <div className="notebook-card max-w-md w-full p-8 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--ink)]">手帳遇到了一點狀況</h2>
              <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed">
                別擔心，您的工具資料均已安全儲存。這可能是因為第三方嵌入的小程式語法有誤或網路連線暫時中斷。
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-[var(--paper)] rounded-notebook-sm text-left border border-[var(--line)]">
                <p className="text-[11px] font-mono text-[var(--muted)] break-all line-clamp-3">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="notebook-btn-primary flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs"
              >
                <RotateCcw size={14} />
                <span>重新整理</span>
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="notebook-btn-secondary flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs"
              >
                <Home size={14} />
                <span>返回大廳</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
