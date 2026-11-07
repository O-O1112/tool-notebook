import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LoginWelcomeIllustration } from './Illustrations';

export default function LoginCard({
  isModal = false,
  onClose = null,
  onSuccess = null,
  defaultIsRegister = false,
}) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(defaultIsRegister);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsRegister(defaultIsRegister);
  }, [defaultIsRegister]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({
          username: username.trim(),
          password,
          displayName: displayName.trim() || username.trim(),
        });
      } else {
        await login(username.trim(), password);
      }
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || '操作失敗，請確認輸入資料');
    } finally {
      setLoading(false);
    }
  };

  const cardContent = (
    <div className="notebook-card w-full max-w-[420px] p-8 sm:p-10 shadow-2xl relative">
      {/* 關閉按鈕 (僅在彈窗模式呈現) */}
      {isModal && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-lg transition-colors"
          title="關閉視窗"
        >
          <X size={16} />
        </button>
      )}

      {/* 頂部 Logo 與標題 */}
      <div className="flex items-center gap-3.5 mb-4">
        <div className="brand-mark">
          <BookOpen size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--ink)] tracking-tight">
            工具小本本
          </h1>
          <p className="text-xs text-[var(--muted)]">多功能工具嵌入空間</p>
        </div>
      </div>

      {/* 迎賓手繪手帳插圖 */}
      <div className="flex justify-center mb-5 pointer-events-none">
        <LoginWelcomeIllustration className="w-52 h-20 text-[var(--ink)] opacity-85" />
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-notebook-sm">
          {error}
        </div>
      )}

      {/* 登入 / 註冊表單 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1">
              姓名 / 稱呼
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="例如：王大明"
              className="notebook-input w-full"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-[var(--ink)] mb-1">
            帳號名稱
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="請輸入帳號"
            className="notebook-input w-full"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--ink)] mb-1">
            密碼
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="請輸入密碼"
            className="notebook-input w-full"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="notebook-btn-primary w-full py-2.5 mt-2 font-bold"
        >
          <span>{loading ? '處理中…' : isRegister ? '免費註冊並開啟空間' : '登入工作空間'}</span>
          <ArrowRight size={16} />
        </button>
      </form>

      {/* 切換登入 / 註冊 */}
      <div className="mt-5 text-center pt-3 border-t border-[var(--line)]">
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
          className="text-xs text-[var(--muted)] hover:text-[var(--coral)] transition-colors font-medium"
        >
          {isRegister ? '已有帳號？返回登入' : '還沒有帳號？立即免費註冊'}
        </button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11151a]/60 backdrop-blur-sm animate-fadeIn">
        <div className="fixed inset-0" onClick={onClose} />
        <div className="relative z-10 w-full max-w-[420px] animate-scaleUp">
          {cardContent}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 notebook-grid-bg">
      {cardContent}
    </div>
  );
}
