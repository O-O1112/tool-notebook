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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2a2e]/50 backdrop-blur-sm animate-fadeIn">
      <div className="notebook-card w-full max-w-sm p-6 bg-white shadow-2xl relative overflow-hidden">
        {/* 背景復古黃銅鑰匙飾紋 */}
        <div className="absolute right-12 top-3 pointer-events-none opacity-30 dark:opacity-20">
          <VintageKeyDoodle className="w-13 h-13 text-[#f59e0b]" />
        </div>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-[#89959b] hover:text-[#1f2a2e] hover:bg-[#f5f7f6] rounded-md transition-colors z-10"
        >
          <X size={16} />
        </button>

        <div className="w-12 h-12 rounded-xl bg-[#fff0eb] text-[#e17b62] flex items-center justify-center mb-3.5 border border-[#e1ac9e]">
          <KeyRound size={22} />
        </div>

        <h3 className="text-base font-bold text-[#1f2a2e] mb-1">輸入空間邀請碼</h3>
        <p className="text-xs text-[#89959b] mb-4 leading-relaxed">
          輸入建立者提供的空間邀請碼（例如：<code className="text-[#e17b62] font-semibold">SPC-2026</code>），即可立即加入該空間並同步操作小工具。
        </p>

        {error && (
          <div className="mb-3.5 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-notebook-sm">
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

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="notebook-btn-secondary text-xs"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="notebook-btn-primary text-xs"
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
