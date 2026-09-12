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
  User,
  Users,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  RefreshCw,
  FolderHeart,
  Grid,
  Compass,
  Smile,
  Shield,
  FolderX,
} from 'lucide-react';

const COVER_COLORS = [
  { bg: '#fff0eb', border: '#f7d2c8', accent: '#e17b62' }, // 珊瑚蜜桃
  { bg: '#f1f9f6', border: '#c7eadc', accent: '#3b827e' }, // 薄荷松綠
  { bg: '#f0f7ff', border: '#cce1ff', accent: '#3b82f6' }, // 天峰蔚藍
  { bg: '#f7f2fd', border: '#e5d3f8', accent: '#8b5cf6' }, // 薰衣草紫
  { bg: '#fefde8', border: '#fae99f', accent: '#d97706' }, // 晨曦暖黃
  { bg: '#fbf4ee', border: '#ecd9c8', accent: '#a05e46' }, // 典雅焦糖
];

const WEEKDAYS = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

export default function SpaceDashboard({
  spaces = [],
  favoriteSpaceIds = [],
  trashSpaceIds = [],
  recentAccessMap = {},
  onSelectSpace,
  onCreateSpaceClick,
  onOpenJoinModal,
  onToggleFavorite,
  onMoveToTrash,
  onRestoreFromTrash,
  onOpenQRCode,
  onOpenSettings,
  onDeleteSpace,
  user,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('recent'); // 'recent' | 'owned' | 'shared' | 'favorites' | 'trash'
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'name'
  const [activeMenuSpaceId, setActiveMenuSpaceId] = useState(null);
  const [copiedCodeSpaceId, setCopiedCodeSpaceId] = useState(null);

  const displayName = user?.displayName || user?.display_name || user?.username || '同學';
  const todayGreeting = `${WEEKDAYS[new Date().getDay()]}快樂！`;

  // 1. 空間分類與統計 (垃圾桶隔離)
  const activeSpaces = useMemo(
    () => spaces.filter((s) => !trashSpaceIds.includes(s.id)),
    [spaces, trashSpaceIds]
  );

  const trashSpaces = useMemo(
    () => spaces.filter((s) => trashSpaceIds.includes(s.id)),
    [spaces, trashSpaceIds]
  );

  const ownedSpaces = useMemo(
    () => activeSpaces.filter((s) => s.is_owner === 1 || s.user_id === user?.id),
    [activeSpaces, user]
  );

  const sharedSpaces = useMemo(
    () => activeSpaces.filter((s) => s.is_owner !== 1 && s.user_id !== user?.id),
    [activeSpaces, user]
  );

  const favoriteSpaces = useMemo(
    () => activeSpaces.filter((s) => favoriteSpaceIds.includes(s.id)),
    [activeSpaces, favoriteSpaceIds]
  );

  const recentSpaces = useMemo(() => {
    return [...activeSpaces].sort((a, b) => {
      const aTime = recentAccessMap[a.id] || (a.updated_at ? new Date(a.updated_at).getTime() : 0);
      const bTime = recentAccessMap[b.id] || (b.updated_at ? new Date(b.updated_at).getTime() : 0);
      return bTime - aTime;
    });
  }, [activeSpaces, recentAccessMap]);

  // 2. 依據選中的側邊選單取得空間列表
  const displayedSpaces = useMemo(() => {
    let list = [];
    switch (activeNav) {
      case 'recent':
        list = recentSpaces;
        break;
      case 'owned':
        list = ownedSpaces;
        break;
      case 'shared':
        list = sharedSpaces;
        break;
      case 'favorites':
        list = favoriteSpaces;
        break;
      case 'trash':
        list = trashSpaces;
        break;
      default:
        list = activeSpaces;
    }

    // 關鍵字搜尋過濾
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.invite_code?.toLowerCase().includes(q)
      );
    }

    // 排序處理
    if (sortBy === 'name') {
      list = [...list].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'zh-Hant'));
    } else if (sortBy === 'recent' && activeNav !== 'recent') {
      list = [...list].sort((a, b) => {
        const aTime = recentAccessMap[a.id] || (a.updated_at ? new Date(a.updated_at).getTime() : 0);
        const bTime = recentAccessMap[b.id] || (b.updated_at ? new Date(b.updated_at).getTime() : 0);
        return bTime - aTime;
      });
    }

    return list;
  }, [
    activeNav,
    recentSpaces,
    ownedSpaces,
    sharedSpaces,
    favoriteSpaces,
    trashSpaces,
    activeSpaces,
    searchQuery,
    sortBy,
    recentAccessMap,
  ]);

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
        return { label: '貨架分欄', icon: <Kanban size={12} className="text-[#e17b62] shrink-0" /> };
      case 'wall':
        return { label: '瀑布流', icon: <Columns3 size={12} className="text-[#3b827e] shrink-0" /> };
      case 'tabs':
        return { label: '分頁輪播', icon: <Layers size={12} className="text-[#8b5cf6] shrink-0" /> };
      case 'collapsed':
        return { label: '折起專注', icon: <ListCollapse size={12} className="text-[#d97706] shrink-0" /> };
      default:
        return { label: '網格並排', icon: <LayoutGrid size={12} className="text-[#3b82f6] shrink-0" /> };
    }
  };

  const getNavTitle = () => {
    switch (activeNav) {
      case 'recent':
        return '最近使用';
      case 'owned':
        return '由我建立';
      case 'shared':
        return '他人共享';
      case 'favorites':
        return '我的最愛';
      case 'trash':
        return '資源回收桶';
      default:
        return '全部空間';
    }
  };

  const getNavEmptyMessage = () => {
    switch (activeNav) {
      case 'favorites':
        return {
          title: '尚無已加星號的空間',
          desc: '點擊空間卡片右上角的 ⭐ 星星圖標，即可將常用空間加入我的最愛。',
          action: null,
        };
      case 'trash':
        return {
          title: '資源回收桶乾乾淨淨',
          desc: '這裡沒有被移至垃圾桶的空間，安心創作無負擔。',
          action: null,
        };
      case 'shared':
        return {
          title: '尚無他人共享的空間',
          desc: '點擊「加入他人空間」，輸入好友或同事的邀請碼即可共同協作！',
          action: onOpenJoinModal,
          actionText: '輸入邀請碼加入',
        };
      case 'owned':
        return {
          title: '您尚未建立任何手帳空間',
          desc: '立即點擊按鈕建立您的第一個主題手帳空間，開啟靈活工作看板！',
          action: onCreateSpaceClick,
          actionText: '立即建立新空間',
        };
      default:
        return {
          title: '尚未有空間記錄',
          desc: '點擊下方按鈕建立全新空間，或是加入團隊分享的手帳本！',
          action: onCreateSpaceClick,
          actionText: '建立新空間',
        };
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col md:flex-row items-stretch gap-5 lg:gap-7 min-h-[calc(100vh-140px)] animate-fadeIn">
      {/* ========================================================
          行動端快速導覽分類條 (Mobile Adaptive Category Bar)
          ======================================================== */}
      <div className="md:hidden space-y-3 bg-[var(--card-bg)] p-3.5 rounded-2xl border border-[var(--line,#e4e8e5)] shadow-xs">
        {/* 行動端名片與問候 (點擊可開啟帳號設定) */}
        <div className="flex items-center justify-between gap-3">
          <div
            onClick={() => onOpenSettings && onOpenSettings(null, 'account')}
            role="button"
            tabIndex={0}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
            title="點擊前往個人帳號設定"
          >
            <div className="w-8 h-8 rounded-xl bg-[#fff0eb] border border-[#f7d2c8] flex items-center justify-center text-[#e17b62] font-bold text-sm shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              {displayName.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h2 className="text-xs font-bold text-[var(--ink,#1f2a2e)] truncate group-hover:text-[var(--coral,#e17b62)] transition-colors">
                  您好，{displayName}
                </h2>
                <User size={11} className="text-[var(--muted,#89959b)] group-hover:text-[var(--coral,#e17b62)] shrink-0" />
              </div>
              <span className="text-[10px] text-[var(--coral,#e17b62)] font-medium">{todayGreeting}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenSettings && (
              <button
                type="button"
                onClick={() => onOpenSettings(null, 'appearance')}
                className="notebook-btn-secondary text-[11px] py-1.5 px-2 flex items-center gap-1"
                title="帳號與偏好設定"
              >
                <Settings size={12} className="text-[#3b827e]" />
                <span>設定</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenJoinModal}
              className="notebook-btn-secondary text-[11px] py-1.5 px-2.5 flex items-center gap-1"
              title="加入空間"
            >
              <KeyRound size={12} className="text-[#3b827e]" />
              <span>加入</span>
            </button>
            <button
              type="button"
              onClick={onCreateSpaceClick}
              className="notebook-btn-primary text-[11px] py-1.5 px-2.5 flex items-center gap-1"
            >
              <Plus size={13} />
              <span>建立</span>
            </button>
          </div>
        </div>

        {/* 搜尋空間輸入框 */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted,#89959b)] pointer-events-none shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋手帳或空間…"
            className="notebook-input notebook-input-search w-full text-xs pl-7 py-1.5"
          />
        </div>

        {/* 5 分類橫向切換藥丸列 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setActiveNav('recent')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              activeNav === 'recent'
                ? 'bg-[#fff0eb] text-[#e17b62] font-bold shadow-xs'
                : 'bg-[var(--paper,#f5f7f6)] text-[var(--ink,#1f2a2e)]'
            }`}
          >
            <Clock size={13} />
            <span>最近 ({recentSpaces.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveNav('owned')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              activeNav === 'owned'
                ? 'bg-[#fff0eb] text-[#e17b62] font-bold shadow-xs'
                : 'bg-[var(--paper,#f5f7f6)] text-[var(--ink,#1f2a2e)]'
            }`}
          >
            <FolderHeart size={13} />
            <span>自建 ({ownedSpaces.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveNav('shared')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              activeNav === 'shared'
                ? 'bg-[#fff0eb] text-[#e17b62] font-bold shadow-xs'
                : 'bg-[var(--paper,#f5f7f6)] text-[var(--ink,#1f2a2e)]'
            }`}
          >
            <Users size={13} />
            <span>共享 ({sharedSpaces.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveNav('favorites')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              activeNav === 'favorites'
                ? 'bg-amber-50 text-amber-600 font-bold shadow-xs'
                : 'bg-[var(--paper,#f5f7f6)] text-[var(--ink,#1f2a2e)]'
            }`}
          >
            <Star size={13} className={activeNav === 'favorites' ? 'fill-amber-400 text-amber-500' : ''} />
            <span>最愛 ({favoriteSpaces.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveNav('trash')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              activeNav === 'trash'
                ? 'bg-red-50 text-red-600 font-bold shadow-xs'
                : 'bg-[var(--paper,#f5f7f6)] text-[var(--muted,#89959b)]'
            }`}
          >
            <Trash2 size={13} />
            <span>回收桶 ({trashSpaces.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          桌面端左側邊欄工作區導覽 (Desktop Sidebar Dashboard)
          ======================================================== */}
      <aside className="hidden md:flex md:w-64 lg:w-72 xl:w-80 shrink-0 flex-col justify-between space-y-5 sticky top-20 self-start">
        <div className="space-y-4">
          {/* 使用者名片迎賓區 (點擊可前往個人帳號設定) */}
          <div
            onClick={() => onOpenSettings && onOpenSettings(null, 'account')}
            role="button"
            tabIndex={0}
            className="notebook-card p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:border-[#f7d2c8] hover:bg-[#fff9f7] transition-all group shadow-xs"
            title="點擊前往個人帳號設定"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#fff0eb] border border-[#f7d2c8] flex items-center justify-center text-[#e17b62] font-bold text-base shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                {displayName.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-[var(--ink,#1f2a2e)] truncate group-hover:text-[var(--coral,#e17b62)] transition-colors">
                  您好，{displayName}
                </h2>
                <p className="text-[11px] text-[var(--coral,#e17b62)] font-medium flex items-center gap-1">
                  <span>{todayGreeting}</span>
                </p>
              </div>
            </div>
            <span className="text-[11px] px-2 py-1 rounded-lg bg-[var(--paper,#f5f7f6)] text-[var(--muted,#89959b)] group-hover:bg-[#fff0eb] group-hover:text-[#e17b62] transition-colors flex items-center gap-1 shrink-0">
              <User size={12} />
              <span>帳號</span>
            </span>
          </div>

          {/* 搜尋空間輸入框 */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted,#89959b)] pointer-events-none shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋手帳或空間…"
              className="notebook-input notebook-input-search w-full text-xs pl-8 py-2"
            />
          </div>

          {/* 5 大核心分類導覽清單 */}
          <nav className="space-y-1 bg-[var(--card-bg)] p-2 rounded-2xl border border-[var(--line,#e4e8e5)] shadow-xs">
            {/* 1. 最近使用 */}
            <button
              type="button"
              onClick={() => setActiveNav('recent')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'recent'
                  ? 'bg-[#fff0eb] text-[#e17b62] font-bold shadow-xs'
                  : 'text-[var(--ink,#1f2a2e)] hover:bg-[var(--paper,#f5f7f6)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock size={15} className={activeNav === 'recent' ? 'text-[#e17b62]' : 'text-[var(--muted,#89959b)]'} />
                <span>最近使用</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-white/70 border border-current/20 text-current">
                {recentSpaces.length}
              </span>
            </button>

            {/* 2. 由我建立 */}
            <button
              type="button"
              onClick={() => setActiveNav('owned')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'owned'
                  ? 'bg-[#fff0eb] text-[#e17b62] font-bold shadow-xs'
                  : 'text-[var(--ink,#1f2a2e)] hover:bg-[var(--paper,#f5f7f6)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderHeart size={15} className={activeNav === 'owned' ? 'text-[#e17b62]' : 'text-[var(--muted,#89959b)]'} />
                <span>由我建立</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-white/70 border border-current/20 text-current">
                {ownedSpaces.length}
              </span>
            </button>

            {/* 3. 他人共享 */}
            <button
              type="button"
              onClick={() => setActiveNav('shared')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'shared'
                  ? 'bg-[#fff0eb] text-[#e17b62] font-bold shadow-xs'
                  : 'text-[var(--ink,#1f2a2e)] hover:bg-[var(--paper,#f5f7f6)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users size={15} className={activeNav === 'shared' ? 'text-[#e17b62]' : 'text-[var(--muted,#89959b)]'} />
                <span>他人共享</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-white/70 border border-current/20 text-current">
                {sharedSpaces.length}
              </span>
            </button>

            {/* 4. 我的最愛 */}
            <button
              type="button"
              onClick={() => setActiveNav('favorites')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'favorites'
                  ? 'bg-amber-50 text-amber-600 font-bold shadow-xs border border-amber-200/60'
                  : 'text-[var(--ink,#1f2a2e)] hover:bg-[var(--paper,#f5f7f6)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star
                  size={15}
                  className={activeNav === 'favorites' ? 'text-amber-500 fill-amber-500' : 'text-[var(--muted,#89959b)]'}
                />
                <span>我的最愛</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-white/70 border border-current/20 text-current">
                {favoriteSpaces.length}
              </span>
            </button>

            {/* 5. 資源回收桶 */}
            <button
              type="button"
              onClick={() => setActiveNav('trash')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'trash'
                  ? 'bg-red-50 text-red-600 font-bold shadow-xs border border-red-200/60'
                  : 'text-[var(--muted,#89959b)] hover:text-red-500 hover:bg-red-50/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Trash2 size={15} className={activeNav === 'trash' ? 'text-red-500' : 'text-[var(--muted,#89959b)]'} />
                <span>資源回收桶</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-white/70 border border-current/20 text-current">
                {trashSpaces.length}
              </span>
            </button>

            {/* 分隔線與偏好設定群組 */}
            <div className="pt-2 pb-1 px-3">
              <div className="h-[1px] bg-[var(--line,#e4e8e5)] mb-2" />
              <span className="text-[10px] font-bold tracking-wider text-[var(--muted,#89959b)] uppercase">
                偏好與管理
              </span>
            </div>

            {/* 帳號設定入口 */}
            <button
              type="button"
              onClick={() => onOpenSettings && onOpenSettings(null, 'account')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[var(--ink,#1f2a2e)] hover:bg-[var(--paper,#f5f7f6)] hover:text-[#e17b62] transition-all"
              title="修改顯示暱稱與帳號資訊"
            >
              <div className="flex items-center gap-2.5">
                <User size={15} className="text-[#3b827e]" />
                <span>帳號設定</span>
              </div>
              <span className="text-[10px] text-[var(--muted,#89959b)]">個人資料</span>
            </button>

            {/* 偏好與外觀入口 */}
            <button
              type="button"
              onClick={() => onOpenSettings && onOpenSettings(null, 'appearance')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[var(--ink,#1f2a2e)] hover:bg-[var(--paper,#f5f7f6)] hover:text-[#e17b62] transition-all"
              title="主題紙質與預設偏好"
            >
              <div className="flex items-center gap-2.5">
                <Settings size={15} className="text-[#e17b62]" />
                <span>偏好與外觀</span>
              </div>
              <span className="text-[10px] text-[var(--muted,#89959b)]">主題紙質</span>
            </button>
          </nav>
        </div>

        {/* 側邊欄底部配額卡片 */}
        <div className="p-3.5 rounded-xl bg-[var(--paper,#f5f7f6)] border border-[var(--line,#e4e8e5)] text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[var(--ink,#1f2a2e)]">手帳工作空間</span>
            <span className="notebook-badge bg-white text-[10px] text-[var(--muted,#89959b)]">已啟用</span>
          </div>
          <p className="text-[11px] text-[var(--muted,#89959b)] leading-relaxed">
            已使用 {ownedSpaces.length} 個由您建立的空間，無限無拘束自由編排。
          </p>
        </div>
      </aside>

      {/* ========================================================
          右側工作空間主內容區 (Main Content Area)
          ======================================================== */}
      <section className="flex-1 min-w-0 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          {/* 主標題與排序切換列 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[var(--line,#e4e8e5)]">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-[var(--ink,#1f2a2e)] flex items-center gap-2">
                <span>{getNavTitle()}</span>
              </h1>
              <span className="notebook-badge text-xs">
                {displayedSpaces.length} 個手帳空間
              </span>
            </div>

            {/* 排序方式切換 */}
            <div className="flex items-center gap-1 bg-[var(--card-bg)] p-1 rounded-xl border border-[var(--line,#e4e8e5)] text-xs">
              <button
                type="button"
                onClick={() => setSortBy('recent')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  sortBy === 'recent'
                    ? 'bg-[#fff0eb] text-[#e17b62] font-bold shadow-xs'
                    : 'text-[var(--muted,#89959b)] hover:text-[var(--ink,#1f2a2e)]'
                }`}
              >
                修改日期
              </button>
              <button
                type="button"
                onClick={() => setSortBy('name')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  sortBy === 'name'
                    ? 'bg-[#fff0eb] text-[#e17b62] font-bold shadow-xs'
                    : 'text-[var(--muted,#89959b)] hover:text-[var(--ink,#1f2a2e)]'
                }`}
              >
                名稱 A-Z
              </button>
            </div>
          </div>

          {/* 空間卡片自適應滿版網格清單 */}
          {displayedSpaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
              {displayedSpaces.map((sp, idx) => {
                const isFavorite = favoriteSpaceIds.includes(sp.id);
                const isTrashItem = trashSpaceIds.includes(sp.id);
                const coverStyle = COVER_COLORS[idx % COVER_COLORS.length];
                const layoutInfo = getLayoutInfo(sp.layout);
                const isOwner = sp.is_owner === 1 || sp.user_id === user?.id;

                return (
                  <div
                    key={sp.id}
                    onClick={() => {
                      if (!isTrashItem) onSelectSpace(sp.id);
                    }}
                    className={`dashboard-space-card group ${isTrashItem ? 'opacity-70 hover:opacity-100' : ''}`}
                  >
                    {/* 卡片頂部封面底紋 */}
                    <div
                      className="dashboard-cover dashboard-cover-pattern"
                      style={{
                        backgroundColor: isTrashItem ? '#f0f2f1' : coverStyle.bg,
                        borderBottom: `1px solid ${isTrashItem ? '#dbe0dd' : coverStyle.border}`,
                      }}
                    >
                      {/* 佈局模式徽章 */}
                      <span className="notebook-badge bg-white/90 backdrop-blur text-[11px] shadow-xs flex items-center gap-1">
                        {layoutInfo.icon}
                        <span>{layoutInfo.label}</span>
                      </span>

                      {/* 右上角快捷操作：加星號 ⭐、空間設定 ⚙️ 或更多選單 */}
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {!isTrashItem && (
                          <>
                            <button
                              type="button"
                              onClick={() => onToggleFavorite && onToggleFavorite(sp.id)}
                              className={`p-1.5 rounded-lg transition-all ${
                                isFavorite
                                  ? 'text-amber-500 bg-white/90 shadow-xs'
                                  : 'text-slate-400 hover:text-amber-500 hover:bg-white/90'
                              }`}
                              title={isFavorite ? '從我的最愛移除' : '加入我的最愛'}
                            >
                              <Star size={15} className={isFavorite ? 'fill-amber-400 text-amber-500' : ''} />
                            </button>

                            {onOpenSettings && (
                              <button
                                type="button"
                                onClick={() => onOpenSettings(sp, 'info')}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#e17b62] hover:bg-white/90 transition-all shadow-xs"
                                title="手帳空間設定 (名稱、描述、備份等)"
                              >
                                <Settings size={15} />
                              </button>
                            )}
                          </>
                        )}

                        {/* 更多功能下拉選單 */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActiveMenuSpaceId(activeMenuSpaceId === sp.id ? null : sp.id)}
                            className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-[var(--muted,#89959b)] hover:text-[var(--ink,#1f2a2e)] shadow-xs transition-colors"
                          >
                            <MoreVertical size={14} />
                          </button>

                          {activeMenuSpaceId === sp.id && (
                            <div
                              className="absolute right-0 mt-1 w-44 bg-[var(--card-bg)] rounded-xl border border-[var(--line,#e4e8e5)] shadow-xl z-30 p-1 animate-fadeIn text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {!isTrashItem ? (
                                <>
                                  {onOpenQRCode && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveMenuSpaceId(null);
                                        onOpenQRCode(sp);
                                      }}
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--paper,#f5f7f6)] flex items-center gap-2 text-[var(--ink,#1f2a2e)]"
                                    >
                                      <QrCode size={13} className="text-[#3b827e]" />
                                      <span>分享 QR Code</span>
                                    </button>
                                  )}

                                  {onOpenSettings && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveMenuSpaceId(null);
                                        onOpenSettings(sp, 'info');
                                      }}
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--paper,#f5f7f6)] flex items-center gap-2 text-[var(--ink,#1f2a2e)]"
                                    >
                                      <Settings size={13} className="text-[#e17b62]" />
                                      <span>空間設定</span>
                                    </button>
                                  )}

                                  {isOwner && onMoveToTrash && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveMenuSpaceId(null);
                                        onMoveToTrash(sp.id);
                                      }}
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2"
                                    >
                                      <Trash2 size={13} />
                                      <span>移至回收桶</span>
                                    </button>
                                  )}
                                </>
                              ) : (
                                <>
                                  {onRestoreFromTrash && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveMenuSpaceId(null);
                                        onRestoreFromTrash(sp.id);
                                      }}
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 flex items-center gap-2 font-medium"
                                    >
                                      <RefreshCw size={13} />
                                      <span>還原此空間</span>
                                    </button>
                                  )}

                                  {isOwner && onDeleteSpace && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveMenuSpaceId(null);
                                        onDeleteSpace(sp.id);
                                      }}
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
                                    >
                                      <Trash2 size={13} />
                                      <span>永久銷毀</span>
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 卡片內容資訊區 */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-bold text-sm text-[var(--ink,#1f2a2e)] group-hover:text-[var(--coral,#e17b62)] transition-colors truncate">
                            {sp.name}
                          </h3>
                        </div>
                        <p className="text-xs text-[var(--muted,#89959b)] line-clamp-2 leading-relaxed">
                          {sp.description || '點擊進入空間查看自訂工具與手帳內容…'}
                        </p>
                      </div>

                      {/* 底部元數據與快捷邀請碼 */}
                      <div className="pt-2 border-t border-[var(--line,#e4e8e5)]/60 flex items-center justify-between text-[11px] text-[var(--muted,#89959b)]">
                        <div className="flex items-center gap-2">
                          <span className="notebook-badge bg-[var(--paper,#f5f7f6)] border-none text-[10px] px-1.5 py-0.5">
                            {sp.tool_count || 0} 個工具
                          </span>
                          <span>{isOwner ? '我建立的' : `由 ${sp.owner_name || '同伴'} 共享`}</span>
                        </div>

                        {/* 回收桶操作 vs 正常邀請碼 */}
                        {isTrashItem ? (
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => onRestoreFromTrash && onRestoreFromTrash(sp.id)}
                              className="text-[11px] text-emerald-600 hover:underline font-bold"
                            >
                              還原
                            </button>
                            <span className="text-[var(--line,#e4e8e5)]">|</span>
                            <button
                              type="button"
                              onClick={() => onDeleteSpace && onDeleteSpace(sp.id)}
                              className="text-[11px] text-red-500 hover:underline font-bold"
                            >
                              永久刪除
                            </button>
                          </div>
                        ) : sp.invite_code ? (
                          <button
                            type="button"
                            onClick={(e) => handleCopyCode(e, sp.invite_code, sp.id)}
                            className="flex items-center gap-1 hover:text-[var(--coral,#e17b62)] transition-colors font-mono"
                            title="點擊複製空間邀請碼"
                          >
                            <KeyRound size={11} className="shrink-0" />
                            <span>{copiedCodeSpaceId === sp.id ? '已複製！' : sp.invite_code}</span>
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 末尾快速新增虛線卡片 (僅在非回收桶視圖顯示) */}
              {activeNav !== 'trash' && (
                <button
                  type="button"
                  onClick={onCreateSpaceClick}
                  className="dashboard-create-card min-h-[190px] flex flex-col items-center justify-center p-6 text-center gap-2.5 text-[var(--coral,#e17b62)]"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#fff0eb] border border-[#f7d2c8] flex items-center justify-center shadow-xs">
                    <Plus size={20} />
                  </div>
                  <div className="text-xs font-bold text-[var(--ink,#1f2a2e)]">建立新手帳空間</div>
                  <div className="text-[11px] text-[var(--muted,#89959b)] max-w-[160px]">
                    自訂分欄貨架、嵌入課堂或工作小工具
                  </div>
                </button>
              )}
            </div>
          ) : (
            /* 無資料時的手繪風空狀態卡片 */
            <div className="p-12 notebook-card bg-[var(--card-bg)] text-center space-y-3 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-14 h-14 rounded-2xl bg-[#fff0eb] border border-[#f7d2c8] flex items-center justify-center text-[#e17b62] shadow-xs">
                {activeNav === 'favorites' ? (
                  <Star size={24} className="fill-amber-400 text-amber-500" />
                ) : activeNav === 'trash' ? (
                  <Trash2 size={24} className="text-emerald-500" />
                ) : activeNav === 'shared' ? (
                  <Users size={24} className="text-[#3b827e]" />
                ) : (
                  <FolderPlus size={24} className="text-[#e17b62]" />
                )}
              </div>
              <h3 className="text-sm font-bold text-[var(--ink,#1f2a2e)]">
                {getNavEmptyMessage().title}
              </h3>
              <p className="text-xs text-[var(--muted,#89959b)] max-w-md leading-relaxed">
                {getNavEmptyMessage().desc}
              </p>
              {getNavEmptyMessage().action && (
                <button
                  type="button"
                  onClick={getNavEmptyMessage().action}
                  className="notebook-btn-primary text-xs py-2 px-4 mt-2"
                >
                  {getNavEmptyMessage().actionText}
                </button>
              )}
            </div>
          )}
        </div>

        {/* 底部精緻手繪風天際線浮水印 Line Art SVG (滿版寬度自適應) */}
        <div className="pt-8 pb-2 w-full flex justify-center items-center pointer-events-none opacity-20 dark:opacity-10 overflow-hidden">
          <svg
            className="w-full max-w-5xl h-16 text-[var(--ink,#1f2a2e)]"
            viewBox="0 0 800 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* 手繪風書本、筆記天際線與建築輪廓 */}
            <path d="M 0 55 L 800 55" />
            <path d="M 30 55 L 30 35 L 50 35 L 50 55" />
            <path d="M 40 35 L 40 25 L 45 20 L 50 25" />
            <path d="M 70 55 L 70 40 L 95 40 L 95 55" />
            <path d="M 120 55 L 120 20 L 145 20 L 145 55" />
            <path d="M 125 25 L 140 25 M 125 32 L 140 32 M 125 39 L 140 39" />
            <path d="M 170 55 L 170 38 L 195 38 L 195 55" />
            <path d="M 220 55 L 220 15 L 235 5 L 250 15 L 250 55" />
            <circle cx="235" cy="25" r="4" />
            <path d="M 270 55 L 270 42 L 300 42 L 300 55" />
            <path d="M 320 55 L 340 30 L 360 55" />
            <path d="M 380 55 L 380 25 L 415 25 L 415 55" />
            <path d="M 390 32 L 405 32 M 390 40 L 405 40" />
            <path d="M 440 55 L 440 35 L 470 35 L 470 55" />
            <path d="M 490 55 L 500 18 L 515 18 L 525 55" />
            <path d="M 505 18 L 508 10 L 512 18" />
            <path d="M 550 55 L 550 30 L 580 30 L 580 55" />
            <path d="M 605 55 L 605 22 L 635 22 L 635 55" />
            <path d="M 615 30 L 625 30 M 615 38 L 625 38 M 615 46 L 625 46" />
            <path d="M 660 55 L 660 40 L 690 40 L 690 55" />
            <path d="M 710 55 L 725 28 L 740 55" />
            <path d="M 760 55 L 760 36 L 785 36 L 785 55" />
          </svg>
        </div>
      </section>
    </div>
  );
}
