import React, { useState } from 'react';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginCard() {
  const { login, register, demoLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      setError(err.message || '操作失敗，請確認輸入資料');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (account) => {
    setError('');
    setLoading(true);
    try {
      await demoLogin(account);
    } catch (err) {
      setError(err.message || '示範登入失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 notebook-grid-bg">
      <div className="notebook-card w-full max-w-[420px] p-8 sm:p-10 shadow-2xl relative">
        {/* 頂部 Logo 與標題 */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="brand-mark">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1f2a2e] tracking-tight">
              工具小本本
            </h1>
            <p className="text-xs text-[#89959b]">多功能工具嵌入空間</p>
          </div>
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-notebook-sm">
            {error}
          </div>
        )}

        {/* 登入 / 註冊表單 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-[#1f2a2e] mb-1">
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
            <label className="block text-xs font-medium text-[#1f2a2e] mb-1">
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
            <label className="block text-xs font-medium text-[#1f2a2e] mb-1">
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
            className="notebook-btn-primary w-full py-2.5 mt-2"
          >
            <span>{loading ? '處理中…' : isRegister ? '註冊並建立空間' : '登入工作空間'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* 切換登入 / 註冊 */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-[#89959b] hover:text-[#e17b62] transition-colors"
          >
            {isRegister ? '已有帳號？返回登入' : '還沒有帳號？立即註冊'}
          </button>
        </div>

        {/* 一鍵體驗示範登入 */}
        <div className="mt-6 pt-5 border-t border-[#e4e8e5]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#89959b] uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} className="text-[#e17b62]" />
              快速體驗 (Demo)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('user_demo')}
              className="notebook-btn-secondary text-xs py-2 w-full justify-center"
            >
              示範帳號 (王大明)
            </button>
            <button
              type="button"
              onClick={() => handleDemo('team_demo')}
              className="notebook-btn-secondary text-xs py-2 w-full justify-center"
            >
              示範帳號 (李小華)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
