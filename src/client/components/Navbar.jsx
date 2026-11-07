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
  Settings,
  Sun,
  Moon,
  Columns3,
  Kanban,
  QrCode,
  Eye,
  ArrowLeft,
  Search,
  Tv,
  Sparkles,
  Share2,
  Users,
  MessageSquare,
  Shield,
  ShieldCheck,
  MoreHorizontal,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  currentView = 'dashboard', // 'dashboard' | 'space' | 'landing'
  onNavigateHome,
  onNavigateLanding,
  spaces = [],
  currentSpace,
  onSelectSpace,
  onOpenCreateModal,
  onOpenJoinModal,
  onAddToolClick,
  onOpenAIModal,
  onOpenSettings,
  onOpenAccountSettings,
  onOpenQRCode,
  layout,
  onToggleLayout,
  onRegenerateCode,
  theme = 'warm',
  onSelectTheme,
  onToggleDarkMode,
  isGuest = false,
  userRole = 'owner',
  canEdit = null,
  onOpenPublishModal,
  onOpenTeamModal,
  onOpenTeamChat,
  onOpenCommandPalette,
  onTogglePresentation,
}) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [teamMenuOpen, setTeamMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const handleCopyCode = () => {
    if (!currentSpace?.invite_code) return;
    navigator.clipboard.writeText(currentSpace.invite_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isOwner = currentSpace?.is_owner === 1 || currentSpace?.user_id === user?.id;
  const effectiveRole = currentSpace?.user_role || (isOwner ? 'owner' : userRole || 'editor');
  const effectiveCanEdit = canEdit !== null ? canEdit : (isOwner || effectiveRole === 'editor');

  return (
    <header className="sticky top-0 z-40 bg-[var(--card-bg)]/90 backdrop-blur border-b border-[var(--line)] px-4 sm:px-6 lg:px-8 py-2.5">
      <div className="w-full flex items-center justify-between gap-3">
        {/* 左側：大廳 vs 空間內導覽 */}
        <div className="flex items-center gap-3">
          {currentView === 'dashboard' ? (
            /* 工具主頁（大廳模式）：品牌標誌與雙首頁切換分段按鈕 */
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="brand-mark">
                  <BookOpen size={18} />
                </div>
                <span className="font-bold text-sm text-[var(--ink)] hidden sm:block leading-tight">
                  工具小本本
                </span>
              </div>

              <div className="h-5 w-[1px] bg-[var(--line)] hidden sm:block" />

              {/* 雙首頁切換分段膠囊 */}
              <div className="bg-[var(--paper)] p-0.5 rounded-xl flex items-center border border-[var(--line)] text-xs">
                {onNavigateLanding && (
                  <button
                    type="button"
                    onClick={onNavigateLanding}
                    className="px-2.5 py-1 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] transition-colors font-medium"
                    title="切換至產品介紹與微應用範本展示首頁"
                  >
                    介紹主頁
                  </button>
                )}
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg bg-[var(--card-bg)] font-bold text-[var(--coral)] shadow-xs transition-colors"
                  title="目前位於工具主頁（空間大廳）"
                >
                  工具主頁
                </button>
              </div>
            </div>
          ) : (
            /* 空間內部模式：返回大廳按鈕與空間切換下拉選單 */
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onNavigateHome}
                className="notebook-btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1.5 text-[var(--muted)] hover:text-[var(--ink)] shrink-0"
                title="返回空間主頁大廳"
              >
                <ArrowLeft size={14} className="shrink-0" />
                <span className="font-semibold whitespace-nowrap hidden sm:inline">返回大廳</span>
              </button>

              <div className="h-5 w-[1px] bg-[var(--line)]" />

              {/* 空間切換下拉選單 */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="notebook-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <span className="max-w-[130px] truncate font-medium">
                    {currentSpace ? currentSpace.name : '選擇空間'}
                  </span>
                  <ChevronDown size={14} className="text-[var(--muted)] shrink-0" />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-64 notebook-card bg-[var(--card-bg)] shadow-xl z-50 p-1.5 animate-fadeIn border border-[var(--line)]">
                    <div className="px-2.5 py-1.5 text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">
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
                          className={`w-full text-left px-2.5 py-2 text-xs rounded-xl transition-colors flex items-center justify-between ${
                            currentSpace?.id === sp.id
                              ? 'bg-[var(--coral-light)] text-[var(--coral)] font-semibold'
                              : 'text-[var(--ink)] hover:bg-[var(--paper)]'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <span className="truncate block">{sp.name}</span>
                            <span className="text-[10px] text-[var(--muted)] font-normal block">
                              {sp.is_owner ? '我建立的' : `由 ${sp.owner_name || '成員'} 共享`}
                            </span>
                          </div>
                          <span className="text-[10px] text-[var(--muted)] shrink-0">
                            {sp.tool_count || 0} 個工具
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-1.5 mt-1 border-t border-[var(--line)] flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          if (onOpenCreateModal) onOpenCreateModal();
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-[var(--coral)] hover:bg-[var(--coral-light)] rounded-xl transition-colors flex items-center gap-1.5 font-medium"
                      >
                        <FolderPlus size={14} />
                        <span>建立新空間…</span>
                      </button>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          if (onOpenJoinModal) onOpenJoinModal();
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-[#3b827e] hover:bg-[#f0f7f6] dark:hover:bg-[#152723] rounded-xl transition-colors flex items-center gap-1.5 font-medium"
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
                <div className="hidden lg:flex items-center gap-1 bg-[var(--coral-light)] border border-[var(--coral-border)] px-2.5 py-1 rounded-xl text-xs whitespace-nowrap shrink-0">
                  <KeyRound size={12} className="text-[var(--coral)] shrink-0" />
                  <span className="text-[11px] text-[var(--muted)]">邀請碼:</span>
                  <span className="font-mono font-bold text-[var(--coral)] tracking-wider">
                    {currentSpace.invite_code}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 hover:text-[var(--coral-hover)] text-[var(--coral)] transition-colors ml-1 shrink-0"
                    title="複製邀請碼"
                  >
                    {copiedCode ? <Check size={12} className="shrink-0" /> : <Copy size={12} className="shrink-0" />}
                  </button>
                  {isOwner && onRegenerateCode && (
                    <button
                      onClick={() => onRegenerateCode(currentSpace.id)}
                      className="p-1 hover:text-[var(--ink)] text-[var(--muted)] transition-colors shrink-0"
                      title="重新產生邀請碼"
                    >
                      <RotateCcw size={11} className="shrink-0" />
                    </button>
                  )}
                </div>
              )}

              {/* 成員身分徽章 */}
              {currentSpace && !isGuest && (
                <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-[var(--paper)] text-[var(--ink)] border border-[var(--line)]">
                  <Shield size={12} className={effectiveRole === 'owner' ? 'text-amber-500' : 'text-blue-500'} />
                  <span>{effectiveRole === 'owner' ? '擁有者' : effectiveRole === 'editor' ? '協作者' : '檢視者'}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 右側工具列 */}
        <div className="flex items-center gap-2">
          {currentView === 'space' ? (
            /* 空間內部右側：佈局切換、搜尋、團隊與發布整合選單、更多功能、新增工具、外觀模式 */
            <>
              {/* 1. 佈局切換器 (貨架分欄 | 瀑布流 | 網格 | 分頁 | 折起專注) */}
              <div className="bg-[var(--paper)] p-0.5 rounded-xl flex items-center border border-[var(--line)] shrink-0">
                <button
                  onClick={() => onToggleLayout('shelf')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    layout === 'shelf'
                      ? 'bg-[var(--card-bg)] text-[var(--coral)] shadow-xs font-semibold'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                  title="分欄收納貨架 (看板模式)"
                >
                  <Kanban size={15} />
                </button>
                <button
                  onClick={() => onToggleLayout('wall')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    layout === 'wall'
                      ? 'bg-[var(--card-bg)] text-[var(--coral)] shadow-xs font-semibold'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                  title="緊湊瀑布流模式"
                >
                  <Columns3 size={15} />
                </button>
                <button
                  onClick={() => onToggleLayout('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    layout === 'grid'
                      ? 'bg-[var(--card-bg)] text-[var(--coral)] shadow-xs font-semibold'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                  title="網格並排模式"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => onToggleLayout('tabs')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    layout === 'tabs'
                      ? 'bg-[var(--card-bg)] text-[var(--coral)] shadow-xs font-semibold'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                  title="分頁輪播模式"
                >
                  <Layers size={15} />
                </button>
                <button
                  onClick={() => onToggleLayout('collapsed')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    layout === 'collapsed'
                      ? 'bg-[var(--card-bg)] text-[var(--coral)] shadow-xs font-semibold'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                  title="折起專注模式"
                >
                  <ListCollapse size={15} />
                </button>
              </div>

              {/* 2. 快捷指令面板按鈕 (Ctrl + K) */}
              {onOpenCommandPalette && (
                <button
                  type="button"
                  onClick={onOpenCommandPalette}
                  className="notebook-btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1.5 text-[var(--muted)] hover:text-[var(--ink)] shrink-0"
                  title="全域快捷指令面板 (Ctrl + K)"
                >
                  <Search size={14} className="shrink-0" />
                  <span className="hidden xl:inline font-normal">搜尋...</span>
                  <kbd className="hidden 2xl:inline-flex items-center text-[10px] font-mono bg-[var(--paper)] px-1.5 py-0.5 rounded border border-[var(--line)] text-[var(--muted)]">
                    Ctrl K
                  </kbd>
                </button>
              )}

              {/* 3. 訪客唯讀標籤 */}
              {isGuest && (
                <div className="flex items-center gap-1 bg-[#f0f7f6] dark:bg-[#152723] text-[#3b827e] border border-[#b8dfd9] dark:border-[#21473f] px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap shrink-0">
                  <Eye size={13} className="shrink-0" />
                  <span>訪客唯讀</span>
                </div>
              )}

              {/* 4. 團隊與發布整合選單 (非訪客模式) */}
              {!isGuest && currentSpace && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setTeamMenuOpen(!teamMenuOpen);
                      setMoreMenuOpen(false);
                    }}
                    className={`notebook-btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1.5 whitespace-nowrap shrink-0 font-medium ${
                      teamMenuOpen ? 'bg-[var(--coral-light)] text-[var(--coral)] border-[var(--coral-border)]' : ''
                    }`}
                    title="團隊討論、成員權限與代管發布中心"
                  >
                    <Users size={14} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span className="hidden md:inline">團隊與發布</span>
                    <ChevronDown size={13} className="text-[var(--muted)] shrink-0" />
                  </button>

                  {teamMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setTeamMenuOpen(false)} />
                      <div className="absolute right-0 mt-1.5 w-56 notebook-card bg-[var(--card-bg)] shadow-xl z-50 p-1.5 animate-fadeIn border border-[var(--line)] text-xs">
                        <div className="px-2.5 py-1 text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                          團隊協作與發布
                        </div>
                        {onOpenTeamChat && (
                          <button
                            type="button"
                            onClick={() => {
                              setTeamMenuOpen(false);
                              onOpenTeamChat();
                            }}
                            className="w-full text-left px-2.5 py-2 hover:bg-[var(--paper)] rounded-xl flex items-center gap-2.5 text-[var(--ink)] transition-colors"
                          >
                            <MessageSquare size={14} className="text-amber-500 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold">團隊討論室</div>
                              <div className="text-[10px] text-[var(--muted)]">即時協作對話與成員動態</div>
                            </div>
                          </button>
                        )}
                        {onOpenTeamModal && (
                          <button
                            type="button"
                            onClick={() => {
                              setTeamMenuOpen(false);
                              onOpenTeamModal();
                            }}
                            className="w-full text-left px-2.5 py-2 hover:bg-[var(--paper)] rounded-xl flex items-center gap-2.5 text-[var(--ink)] transition-colors"
                          >
                            <Users size={14} className="text-emerald-500 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold">團隊成員與角色</div>
                              <div className="text-[10px] text-[var(--muted)]">管理協作者權限與成員清單</div>
                            </div>
                          </button>
                        )}
                        {onOpenPublishModal && (
                          <button
                            type="button"
                            onClick={() => {
                              setTeamMenuOpen(false);
                              onOpenPublishModal();
                            }}
                            className="w-full text-left px-2.5 py-2 hover:bg-[var(--paper)] rounded-xl flex items-center gap-2.5 text-[var(--ink)] transition-colors"
                          >
                            <Share2 size={14} className="text-indigo-500 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-indigo-600 dark:text-indigo-400">發布獨立代管微應用</div>
                              <div className="text-[10px] text-[var(--muted)]">打包為專屬網址與嵌入代碼</div>
                            </div>
                          </button>
                        )}
                        {onOpenQRCode && (
                          <button
                            type="button"
                            onClick={() => {
                              setTeamMenuOpen(false);
                              onOpenQRCode();
                            }}
                            className="w-full text-left px-2.5 py-2 hover:bg-[var(--paper)] rounded-xl flex items-center gap-2.5 text-[var(--ink)] transition-colors"
                          >
                            <QrCode size={14} className="text-[#3b827e] shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold">空間 QR Code</div>
                              <div className="text-[10px] text-[var(--muted)]">手機掃描免登入直達</div>
                            </div>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 5. 更多操作選單 (...) */}
              {!isGuest && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setMoreMenuOpen(!moreMenuOpen);
                      setTeamMenuOpen(false);
                    }}
                    className={`notebook-btn-secondary text-xs p-1.5 flex items-center justify-center shrink-0 ${
                      moreMenuOpen ? 'bg-[var(--coral-light)] text-[var(--coral)] border-[var(--coral-border)]' : 'text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                    title="更多空間功能"
                  >
                    <MoreHorizontal size={15} />
                  </button>

                  {moreMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setMoreMenuOpen(false)} />
                      <div className="absolute right-0 mt-1.5 w-52 notebook-card bg-[var(--card-bg)] shadow-xl z-50 p-1.5 animate-fadeIn border border-[var(--line)] text-xs">
                        <div className="px-2.5 py-1 text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                          工具箱擴充
                        </div>
                        {effectiveCanEdit && onOpenAIModal && (
                          <button
                            type="button"
                            onClick={() => {
                              setMoreMenuOpen(false);
                              onOpenAIModal();
                            }}
                            className="w-full text-left px-2.5 py-2 hover:bg-[var(--paper)] rounded-xl flex items-center gap-2.5 text-[var(--ink)] transition-colors"
                          >
                            <Sparkles size={14} className="text-purple-500 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-purple-600 dark:text-purple-400">AI 智慧代寫</div>
                              <div className="text-[10px] text-[var(--muted)]">自動生成獨立小工具代碼</div>
                            </div>
                          </button>
                        )}
                        {onTogglePresentation && (
                          <button
                            type="button"
                            onClick={() => {
                              setMoreMenuOpen(false);
                              onTogglePresentation();
                            }}
                            className="w-full text-left px-2.5 py-2 hover:bg-[var(--paper)] rounded-xl flex items-center gap-2.5 text-[var(--ink)] transition-colors"
                          >
                            <Tv size={14} className="text-purple-600 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold">投影簡報模式</div>
                              <div className="text-[10px] text-[var(--muted)]">大螢幕無干擾純淨展示 (Shift+P)</div>
                            </div>
                          </button>
                        )}
                        {currentSpace && onOpenSettings && (
                          <button
                            type="button"
                            onClick={() => {
                              setMoreMenuOpen(false);
                              onOpenSettings('info');
                            }}
                            className="w-full text-left px-2.5 py-2 hover:bg-[var(--paper)] rounded-xl flex items-center gap-2.5 text-[var(--ink)] transition-colors"
                          >
                            <Settings size={14} className="text-[var(--coral)] shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold">空間設定與備份</div>
                              <div className="text-[10px] text-[var(--muted)]">修改名稱、備忘與匯出 JSON</div>
                            </div>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 6. 主要行動按鈕：+ 新增工具 */}
              {!isGuest && effectiveCanEdit && (
                <button
                  onClick={onAddToolClick}
                  className="notebook-btn-primary text-xs py-1.5 px-3 whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5"
                  title="新增或貼上小工具"
                >
                  <Plus size={14} className="shrink-0" />
                  <span className="font-semibold">新增工具</span>
                </button>
              )}

              {/* 7. 深色模式一鍵切換按鈕 (Sun / Moon) */}
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="notebook-btn-secondary text-xs p-1.5 flex items-center justify-center shrink-0"
                title={theme === 'dark' ? '切換為日間手帳模式' : '切換為深邃夜墨模式'}
              >
                {theme === 'dark' ? (
                  <Sun size={15} className="text-amber-400 hover:rotate-45 transition-transform shrink-0" />
                ) : (
                  <Moon size={15} className="text-[var(--muted)] hover:-rotate-12 transition-transform shrink-0" />
                )}
              </button>
            </>
          ) : (
            /* 大廳模式右側：快捷指令面板、加入空間、建立空間、主題切換 */
            <>
              {/* 快捷指令面板按鈕 (Ctrl + K) */}
              {onOpenCommandPalette && (
                <button
                  type="button"
                  onClick={onOpenCommandPalette}
                  className="notebook-btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1.5 text-[var(--muted)] hover:text-[var(--ink)] shrink-0"
                  title="全域快捷指令面板 (Ctrl + K)"
                >
                  <Search size={14} className="shrink-0" />
                  <span className="hidden md:inline font-normal">搜尋...</span>
                  <kbd className="hidden lg:inline-flex items-center text-[10px] font-mono bg-[var(--paper)] px-1.5 py-0.5 rounded border border-[var(--line)] text-[var(--muted)]">
                    Ctrl K
                  </kbd>
                </button>
              )}

              {/* 加入空間按鈕 */}
              <button
                type="button"
                onClick={onOpenJoinModal}
                className="notebook-btn-secondary text-xs py-1.5 px-3 hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                title="輸入邀請碼加入他人共享的空間"
              >
                <KeyRound size={13} className="shrink-0 text-[#3b827e]" />
                <span>加入空間</span>
              </button>

              {/* 建立新空間按鈕 */}
              <button
                type="button"
                onClick={onOpenCreateModal}
                className="notebook-btn-primary text-xs py-1.5 px-3 hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Plus size={14} className="shrink-0" />
                <span>建立新空間</span>
              </button>

              {/* 深色模式一鍵切換按鈕 (Sun / Moon) */}
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="notebook-btn-secondary text-xs p-1.5 flex items-center justify-center shrink-0"
                title={theme === 'dark' ? '切換為日間手帳模式' : '切換為深邃夜墨模式'}
              >
                {theme === 'dark' ? (
                  <Sun size={15} className="text-amber-400 hover:rotate-45 transition-transform shrink-0" />
                ) : (
                  <Moon size={15} className="text-[var(--muted)] hover:-rotate-12 transition-transform shrink-0" />
                )}
              </button>

              {/* 設定按鈕 (外觀風格與偏好調節) */}
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={() => onOpenSettings('appearance')}
                  className="notebook-btn-secondary text-xs py-1.5 px-2.5 flex items-center justify-center gap-1.5 shrink-0 text-[var(--muted)] hover:text-[var(--ink)]"
                  title="外觀風格與空間偏好設定"
                >
                  <Settings size={14} className="shrink-0" />
                  <span className="hidden sm:inline">偏好設定</span>
                </button>
              )}
            </>
          )}

          {/* 使用者名稱與登出 */}
          {user ? (
            <>
              <button
                type="button"
                onClick={onOpenAccountSettings || onOpenSettings}
                className="hidden md:flex items-center gap-2 pl-2 border-l border-[var(--line)] hover:opacity-80 transition-opacity text-left cursor-pointer group"
                title="點擊管理個人帳號與暱稱"
              >
                <div className="w-6 h-6 rounded-full bg-[var(--paper)] group-hover:bg-[var(--coral-light)] group-hover:text-[var(--coral)] flex items-center justify-center text-[var(--muted)] transition-colors">
                  <User size={13} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-[var(--ink)] group-hover:text-[var(--coral)] max-w-[100px] truncate transition-colors leading-none">
                    {user?.displayName || user?.display_name || user?.username || '使用者'}
                  </span>
                  <span className="text-[9px] text-[var(--muted)] leading-tight mt-0.5">帳號設定</span>
                </div>
              </button>

              <button
                onClick={logout}
                className="p-1.5 text-[var(--muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                title="登出"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <a
              href={window.location.pathname}
              className="notebook-btn-primary text-xs py-1.5 px-3"
            >
              登入 / 註冊
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
