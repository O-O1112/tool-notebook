import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  BookOpen,
  FolderPlus,
  KeyRound,
  Columns3,
  Kanban,
  LayoutGrid,
  Layers,
  ListCollapse,
  QrCode,
  Copy,
  Check,
  MoreVertical,
  Settings,
  Trash2,
  Users,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const COVER_COLORS = [
  { bg: '#fff0eb', border: '#f7d2c8', accent: '#e17b62' }, // 珊瑚蜜桃
  { bg: '#f1f9f6', border: '#c7eadc', accent: '#3b827e' }, // 薄荷松綠
  { bg: '#f0f7ff', border: '#cce1ff', accent: '#3b82f6' }, // 天峰蔚藍
  { bg: '#f7f2fd', border: '#e5d3f8', accent: '#8b5cf6' }, // 薰衣紫
  { bg: '#fefde8', border: '#fae99f', accent: '#d97706' }, // 晨曦暖黃
];

export default function SpaceDashboard({
  spaces = [],
  onSelectSpace,
  onCreateSpaceClick,
  onOpenJoinModal,
  onOpenQRCode,
  onOpenSettings,
  onDeleteSpace,
  user,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'owned' | 'shared'
  const [activeMenuSpaceId, setActiveMenuSpaceId] = useState(null);
  const [copiedCodeSpaceId, setCopiedCodeSpaceId] = useState(null);

  // 空間分類統計
  const ownedSpaces = useMemo(() => spaces.filter((s) => s.is_owner === 1 || s.user_id === user?.id), [spaces, user]);
  const sharedSpaces = useMemo(() => spaces.filter((s) => s.is_owner !== 1 && s.user_id !== user?.id), [spaces, user]);

  // 搜尋與分頁過濾
  const filteredSpaces = useMemo(() => {
    let list = spaces;
    if (filterTab === 'owned') list = ownedSpaces;
    if (filterTab === 'shared') list = sharedSpaces;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.trim().toLowerCase();
    return list.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.invite_code?.toLowerCase().includes(q)
    );
  }, [spaces, ownedSpaces, sharedSpaces, filterTab, searchQuery]);

  const handleCopyCode = (e, inviteCode, spaceId) => {
    e.stopPropagation();
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopiedCodeSpaceId(spaceId);
    setTimeout(() => setCopiedCodeSpaceId(null), 2000);
  };

  const getLayoutInfo = (layout) => {
    switch (layout) {
      case 'shelf':
        return { label: '貨架分欄', icon: <Columns3 size={13} className="text-[#e17b62]" /> };
      case 'wall':
        return { label: '瀑布流', icon: <Kanban size={13} className="text-[#3b827e]" /> };
      case 'tabs':
        return { label: '分頁輪播', icon: <Layers size={13} className="text-[#8b5cf6]" /> };
      case 'collapsed':
        return { label: '折起專注', icon: <ListCollapse size={13} className="text-[#d97706]" /> };
      default:
        return { label: '網格並排', icon: <LayoutGrid size={13} className="text-[#3b82f6]" /> };
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 頂部迎賓橫幅與快捷控制列 */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#e4e8e5] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="notebook-badge bg-[#fff0eb] text-[#e17b62] border-[#f7d2c8]">
              空間主頁大廳
            </span>
            <span className="text-xs text-[#89959b]">共 {spaces.length} 個空間</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1f2a2e] tracking-tight">
            歡迎回來，{user?.displayName || '同學'}！
          </h1>
          <p className="text-xs text-[#89959b] max-w-xl leading-relaxed">
            選擇任意空間卡片立即進入工作區；或是建立全新主題貨架、掃描 QR Code 共享小工具。
          </p>
        </div>

        {/* 快捷建立與加入按鈕 */}
        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={onOpenJoinModal}
            className="notebook-btn-secondary text-xs py-2 px-3.5 flex-1 md:flex-initial flex items-center justify-center gap-1.5"
            title="輸入他人分享的邀請碼加入空間"
          >
            <KeyRound size={14} className="text-[#3b827e]" />
            <span>加入空間</span>
          </button>
          <button
            type="button"
            onClick={onCreateSpaceClick}
            className="notebook-btn-primary text-xs py-2 px-4 flex-1 md:flex-initial flex items-center justify-center gap-1.5"
          >
            <Plus size={15} />
            <span>建立新空間</span>
          </button>
        </div>
      </div>

      {/* 搜尋列與分類頁籤 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* 頁籤過濾 */}
        <div className="flex items-center gap-1.5 bg-[#f5f7f6] p-1 rounded-xl border border-[#e4e8e5] text-xs">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              filterTab === 'all'
                ? 'bg-white text-[#1f2a2e] font-bold shadow-xs'
                : 'text-[#89959b] hover:text-[#1f2a2e]'
            }`}
          >
            全部空間 ({spaces.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('owned')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              filterTab === 'owned'
                ? 'bg-white text-[#e17b62] font-bold shadow-xs'
                : 'text-[#89959b] hover:text-[#1f2a2e]'
            }`}
          >
            我建立的 ({ownedSpaces.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('shared')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              filterTab === 'shared'
                ? 'bg-white text-[#3b827e] font-bold shadow-xs'
                : 'text-[#89959b] hover:text-[#1f2a2e]'
            }`}
          >
            他人共享 ({sharedSpaces.length})
          </button>
        </div>

        {/* 即時關鍵字搜尋 */}
        <div className="relative min-w-[240px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#89959b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋空間名稱、說明或邀請碼…"
            className="notebook-input w-full pl-8 py-1.5 text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#89959b] hover:text-[#1f2a2e]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 空間卡片牆 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* 卡片 1：引導式新建空間卡片 */}
        <div
          onClick={onCreateSpaceClick}
          className="dashboard-create-card p-6 min-h-[220px] flex flex-col items-center justify-center text-center gap-3 select-none group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#e1ac9e] text-[#e17b62] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-[#1f2a2e] group-hover:text-[#e17b62] transition-colors">
              建立新空間
            </div>
            <p className="text-[11px] text-[#89959b] mt-1 max-w-[180px]">
              自訂分欄貨架看板與微工具嵌入工作區
            </p>
          </div>
        </div>

        {/* 各空間卡片清單 */}
        {filteredSpaces.map((space, index) => {
          const colorTheme = COVER_COLORS[index % COVER_COLORS.length];
          const layoutInfo = getLayoutInfo(space.layout);
          const isOwner = space.is_owner === 1 || space.user_id === user?.id;
          const isMenuOpen = activeMenuSpaceId === space.id;

          return (
            <div
              key={space.id}
              onClick={() => onSelectSpace(space.id)}
              className="dashboard-space-card group"
            >
              {/* 卡片封面條紋與圖示 */}
              <div
                className="dashboard-cover dashboard-cover-pattern border-b border-[#e4e8e5]"
                style={{ backgroundColor: colorTheme.bg }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs border"
                    style={{ borderColor: colorTheme.border, color: colorTheme.accent }}
                  >
                    <BookOpen size={20} />
                  </div>
                  <span className="notebook-badge text-[10px] bg-white/90">
                    {layoutInfo.icon}
                    <span>{layoutInfo.label}</span>
                  </span>
                </div>

                {/* ⋯ 快捷操作選單 */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setActiveMenuSpaceId(isMenuOpen ? null : space.id)}
                    className="p-1.5 text-[#69787f] hover:text-[#1f2a2e] hover:bg-white/70 rounded-lg transition-colors"
                    title="更多空間操作"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-1 w-44 bg-white border border-[#e4e8e5] rounded-xl shadow-xl z-50 p-1.5 text-xs animate-fadeIn space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuSpaceId(null);
                          if (onOpenQRCode) onOpenQRCode(space);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#f5f7f6] text-[#1f2a2e] flex items-center gap-2"
                      >
                        <QrCode size={13} className="text-[#3b827e]" />
                        <span>產出 QR Code</span>
                      </button>

                      {space.invite_code && (
                        <button
                          type="button"
                          onClick={(e) => {
                            handleCopyCode(e, space.invite_code, space.id);
                            setTimeout(() => setActiveMenuSpaceId(null), 800);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#f5f7f6] text-[#1f2a2e] flex items-center gap-2"
                        >
                          {copiedCodeSpaceId === space.id ? (
                            <Check size={13} className="text-emerald-500" />
                          ) : (
                            <Copy size={13} className="text-[#e17b62]" />
                          )}
                          <span>
                            {copiedCodeSpaceId === space.id ? '已複製邀請碼' : `複製邀請碼 (${space.invite_code})`}
                          </span>
                        </button>
                      )}

                      {isOwner && onOpenSettings && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuSpaceId(null);
                            onOpenSettings(space);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#f5f7f6] text-[#1f2a2e] flex items-center gap-2"
                        >
                          <Settings size={13} className="text-[#89959b]" />
                          <span>設定與備份</span>
                        </button>
                      )}

                      {isOwner && onDeleteSpace && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuSpaceId(null);
                            onDeleteSpace(space.id);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-[#f0f2f1] mt-1 pt-1"
                        >
                          <Trash2 size={13} />
                          <span>刪除空間</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 卡片內容：名稱、說明、工具數量與歸屬 */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-sm font-bold text-[#1f2a2e] truncate group-hover:text-[#e17b62] transition-colors" title={space.name}>
                      {space.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#89959b] line-clamp-2 min-h-[30px] leading-relaxed">
                    {space.description || '尚無描述備註'}
                  </p>
                </div>

                {/* 底部中繼資訊列 */}
                <div className="pt-2.5 border-t border-[#f0f2f1] flex items-center justify-between text-[11px]">
                  <span className="text-[#69787f] font-medium flex items-center gap-1">
                    <span>{space.tool_count || 0} 個工具</span>
                  </span>

                  <div className="flex items-center gap-1 text-[#89959b]">
                    {isOwner ? (
                      <span className="notebook-badge-teacher text-[10px] py-0.5 px-2">
                        我建立的
                      </span>
                    ) : (
                      <span className="notebook-badge-student text-[10px] py-0.5 px-2">
                        {space.owner_name || '成員共享'}
                      </span>
                    )}
                    <ArrowRight size={13} className="text-[#89959b] group-hover:text-[#e17b62] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 搜尋無結果提示 */}
      {filteredSpaces.length === 0 && (
        <div className="py-16 text-center text-xs text-[#89959b] bg-white rounded-2xl border border-[#e4e8e5]">
          沒有找到符合「{searchQuery}」的空間，您可以點擊上方建立新空間。
        </div>
      )}
    </div>
  );
}
