import React, { useState } from 'react';
import { X, KeyRound, ArrowRight } from 'lucide-react';
import { VintageKeyDoodle } from './Illustrations';

export default function JoinSpaceModal({ isOpen, onClose, onJoinSuccess }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');

    try {
      await onJoinSuccess(code.trim());
      setCode('');
      onClose();
    } catch (err) {
      setError(err.message || '加入空間失敗，請確認邀請碼是否正確');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11151a]/60 backdrop-blur-sm animate-fadeIn">
      <div className="notebook-modal-box w-full max-w-sm p-6 relative">
        {/* 背景復古黃銅鑰匙飾紋 */}
        <div className="absolute right-12 top-3 pointer-events-none opacity-25 dark:opacity-15">
          <VintageKeyDoodle className="w-13 h-13 text-[#f59e0b]" />
        </div>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-lg transition-colors z-10"
        >
          <X size={16} />
        </button>

        <div className="notebook-modal-badge mb-3.5">
          <KeyRound size={22} />
        </div>

        <h3 className="text-base font-bold text-[var(--ink)] mb-1">輸入空間邀請碼</h3>
        <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
          輸入建立者提供的空間邀請碼（例如：<code className="text-[var(--coral)] font-semibold">SPC-2026</code>），即可立即加入該空間並同步操作小工具。
        </p>

        {error && (
          <div className="mb-3.5 p-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="例如：SPC-2026"
              className="notebook-input w-full font-mono text-center tracking-widest text-base uppercase"
              autoFocus
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 mt-2 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={onClose}
              className="notebook-btn-secondary text-xs py-2 px-4"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="notebook-btn-primary text-xs py-2 px-4"
            >
              <span>{loading ? '驗證中…' : '確認加入'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
