import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  LayoutGrid,
  Layers,
  LogOut,
  ChevronDown,
  FolderPlus,
  KeyRound,
  Copy,
  Check,
  RotateCcw,
  ListCollapse,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  spaces,
  currentSpace,
  onSelectSpace,
  onCreateSpace,
  onOpenJoinModal,
  onAddToolClick,
  layout,
  onToggleLayout,
  onRegenerateCode,
}) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newSpaceModalOpen, setNewSpaceModalOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCreateSpaceSubmit = async (e) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;
    await onCreateSpace(newSpaceName.trim());
    setNewSpaceName('');
    setNewSpaceModalOpen(false);
  };

  const handleCopyCode = () => {
    if (!currentSpace?.invite_code) return;
    navigator.clipboard.writeText(currentSpace.invite_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isOwner = currentSpace?.is_owner === 1 || currentSpace?.user_id === user?.id;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[#e4e8e5] px-4 md:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* 左側：品牌 Logo 與 空間選擇器 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="brand-mark">
                <BookOpen size={18} />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-sm text-[#1f2a2e] block leading-tight">
                  工具小本本
                </span>
                <span className="text-[10px] text-[#89959b]">嵌入空間</span>
              </div>
            </div>

            <div className="h-5 w-[1px] bg-[#e4e8e5] hidden sm:block" />

            {/* 空間切換下拉選單 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="notebook-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <span className="max-w-[130px] truncate font-medium">
                  {currentSpace ? currentSpace.name : '選擇空間'}
                </span>
                <ChevronDown size={14} className="text-[#89959b]" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-64 notebook-card bg-white shadow-xl z-50 p-1.5 animate-fadeIn">
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold text-[#89959b] uppercase tracking-wider">
                    空間清單
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-0.5">
                    {spaces.map((sp) => (
                      <button
                        key={sp.id}
                        onClick={() => {
                          onSelectSpace(sp.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                          currentSpace?.id === sp.id
                            ? 'bg-[#fff9f6] text-[#e17b62] font-semibold'
                            : 'text-[#1f2a2e] hover:bg-[#f5f7f6]'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <span className="truncate block">{sp.name}</span>
                          <span className="text-[10px] text-[#89959b] font-normal block">
                            {sp.is_owner ? '我建立的' : `由 ${sp.owner_name || '成員'} 共享`}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#89959b] shrink-0">
                          {sp.tool_count || 0} 個工具
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-1.5 mt-1 border-t border-[#e4e8e5] flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setNewSpaceModalOpen(true);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-[#e17b62] hover:bg-[#fff0eb] rounded-lg transition-colors flex items-center gap-1.5 font-medium"
                    >
                      <FolderPlus size={14} />
                      <span>建立新空間…</span>
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenJoinModal();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-[#3b827e] hover:bg-[#f0f7f6] rounded-lg transition-colors flex items-center gap-1.5 font-medium"
                    >
                      <KeyRound size={14} />
                      <span>輸入邀請碼加入空間…</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 空間邀請碼標籤 (一鍵複製給團隊成員) */}
            {currentSpace?.invite_code && (
              <div className="hidden lg:flex items-center gap-1 bg-[#fff9f6] border border-[#e1ac9e] px-2.5 py-1 rounded-notebook-sm text-xs">
                <KeyRound size={12} className="text-[#e17b62]" />
                <span className="text-[11px] text-[#89959b]">邀請碼:</span>
                <span className="font-mono font-bold text-[#e17b62] tracking-wider">
                  {currentSpace.invite_code}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1 hover:text-[#cf5e43] text-[#e17b62] transition-colors ml-1"
                  title="複製邀請碼"
                >
                  {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                </button>
                {isOwner && onRegenerateCode && (
                  <button
                    onClick={() => onRegenerateCode(currentSpace.id)}
                    className="p-1 hover:text-[#1f2a2e] text-[#89959b] transition-colors"
                    title="重新產生邀請碼"
                  >
                    <RotateCcw size={11} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 右側：佈局切換、貼上工具、使用者稱呼與登出 */}
          <div className="flex items-center gap-2">
            {/* 佈局切換器 (網格 | 分頁 | 折起專注) */}
            <div className="bg-[#f5f7f6] p-0.5 rounded-notebook-sm flex items-center border border-[#e4e8e5]">
              <button
                onClick={() => onToggleLayout('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  layout === 'grid'
                    ? 'bg-white text-[#e17b62] shadow-sm font-semibold'
                    : 'text-[#89959b] hover:text-[#1f2a2e]'
                }`}
                title="網格並排模式 (支援拖曳重排與縮放)"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => onToggleLayout('tabs')}
                className={`p-1.5 rounded-md transition-colors ${
                  layout === 'tabs'
                    ? 'bg-white text-[#e17b62] shadow-sm font-semibold'
                    : 'text-[#89959b] hover:text-[#1f2a2e]'
                }`}
                title="分頁輪播模式"
              >
                <Layers size={15} />
              </button>
              <button
                onClick={() => onToggleLayout('collapsed')}
                className={`p-1.5 rounded-md transition-colors ${
                  layout === 'collapsed'
                    ? 'bg-white text-[#e17b62] shadow-sm font-semibold'
                    : 'text-[#89959b] hover:text-[#1f2a2e]'
                }`}
                title="折起專注模式 (全部只顯示名稱，點開就放大)"
              >
                <ListCollapse size={15} />
              </button>
            </div>

            {/* 加入空間按鈕 */}
            <button
              onClick={onOpenJoinModal}
              className="notebook-btn-secondary text-xs py-1.5 px-2.5 hidden sm:inline-flex"
              title="輸入邀請碼加入他人共享的空間"
            >
              <KeyRound size={13} />
              <span>加入空間</span>
            </button>

            {/* 貼上工具按鈕 (僅空間擁有者可新增) */}
            {isOwner && (
              <button
                onClick={onAddToolClick}
                className="notebook-btn-primary text-xs py-1.5 px-3"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">貼上工具</span>
              </button>
            )}

            {/* 使用者名稱 */}
            <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-[#e4e8e5]">
              <div className="w-6 h-6 rounded-full bg-[#f0f4f3] flex items-center justify-center text-[#57767f]">
                <User size={13} />
              </div>
              <span className="text-xs font-medium text-[#1f2a2e] max-w-[90px] truncate">
                {user?.displayName}
              </span>
            </div>

            {/* 登出按鈕 */}
            <button
              onClick={logout}
              className="p-1.5 text-[#89959b] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="登出"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* 建立新空間 Modal */}
      {newSpaceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2a2e]/50 backdrop-blur-sm animate-fadeIn">
          <div className="notebook-card w-full max-w-sm p-6 bg-white shadow-2xl">
            <h3 className="text-base font-bold text-[#1f2a2e] mb-1">建立新工具空間</h3>
            <p className="text-xs text-[#89959b] mb-4">系統將自動產生專屬空間邀請碼，方便團隊成員加入</p>
            <form onSubmit={handleCreateSpaceSubmit} className="space-y-4">
              <input
                type="text"
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                placeholder="例如：專案儀表板、個人小程式集"
                className="notebook-input w-full"
                autoFocus
                required
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewSpaceModalOpen(false)}
                  className="notebook-btn-secondary text-xs"
                >
                  取消
                </button>
                <button type="submit" className="notebook-btn-primary text-xs">
                  建立空間
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
