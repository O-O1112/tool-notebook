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
  X,
  Play,
  Send,
  BookTemplate,
  Archive,
} from 'lucide-react';
import { TOOL_TEMPLATES } from '../utils/toolTemplates';
import SandboxedFrame from './SandboxedFrame';
import {
  TrashEmptyIllustration,
  FavoritesEmptyIllustration,
  SpacesEmptyIllustration,
  SharedEmptyIllustration,
  SearchEmptyIllustration,
  PanoramicSkyline,
  CoverDoodle,
  CreateSpaceDoodle,
  BookshelfDoodle,
  WaxSealDoodle,
} from './Illustrations';

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
  archivedSpaceIds = [],
  recentAccessMap = {},
  onSelectSpace,
  onCreateSpaceClick,
  onOpenJoinModal,
  onToggleFavorite,
  onToggleArchive,
  onMoveToTrash,
  onRestoreFromTrash,
  onOpenQRCode,
  onOpenSettings,
  onDeleteSpace,
  onAddTemplateToSpace,
  onCreateSpaceFromTemplate,
  user,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('recent'); // 'recent' | 'templates' | 'owned' | 'shared' | 'favorites' | 'trash'
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'name'
  const [activeMenuSpaceId, setActiveMenuSpaceId] = useState(null);
  const [copiedCodeSpaceId, setCopiedCodeSpaceId] = useState(null);

  // 範本專區狀態
  const [templateCategory, setTemplateCategory] = useState('all');
  const [templateSearch, setTemplateSearch] = useState('');
  const [previewingTemplate, setPreviewingTemplate] = useState(null);
  const [targetSpaceSelectTmpl, setTargetSpaceSelectTmpl] = useState(null);

  const displayName = user?.displayName || user?.display_name || user?.username || '同學';
  const todayGreeting = `${WEEKDAYS[new Date().getDay()]}快樂！`;

  // 範本過濾清單
  const filteredTemplates = useMemo(() => {
    return TOOL_TEMPLATES.filter((t) => {
      const matchCat = templateCategory === 'all' || t.category === templateCategory;
      const matchQuery =
        !templateSearch.trim() ||
        t.title.toLowerCase().includes(templateSearch.trim().toLowerCase()) ||
        t.description.toLowerCase().includes(templateSearch.trim().toLowerCase());
      return matchCat && matchQuery;
    });
  }, [templateCategory, templateSearch]);

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
      case 'templates':
        return '精選小工具範本專區';
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

  const renderEmptyIllustration = () => {
    if (searchQuery.trim()) {
      return <SearchEmptyIllustration className="w-72 sm:w-80 h-44 sm:h-48 mb-2" />;
    }
    switch (activeNav) {
      case 'trash':
        return <TrashEmptyIllustration className="w-72 sm:w-80 h-48 sm:h-52 mb-2" />;
      case 'favorites':
        return <FavoritesEmptyIllustration className="w-72 sm:w-80 h-48 sm:h-52 mb-2" />;
      case 'shared':
        return <SharedEmptyIllustration className="w-72 sm:w-80 h-48 sm:h-52 mb-2" />;
      default:
        return <SpacesEmptyIllustration className="w-72 sm:w-80 h-48 sm:h-52 mb-2" />;
    }
  };

  const getNavEmptyMessage = () => {
    if (searchQuery.trim()) {
      return {
        title: `找不到相符於「${searchQuery.trim()}」的手帳空間`,
        desc: '請嘗試檢查空間名稱、描述關鍵字，或是確認邀請碼無誤。',
        action: () => setSearchQuery(''),
        actionText: '清除搜尋關鍵字',
      };
    }
    switch (activeNav) {
      case 'favorites':
        return {
          title: '尚無已加星號的手帳空間',
          desc: '點擊任何空間卡片右上角的星號標記，即可將常用空間收入我的最愛。',
          action: null,
        };
      case 'trash':
        return {
          title: '您尚未將任何手帳空間丟入垃圾桶',
          desc: '最近刪除的手帳空間將會列在此處，隨時可以安全還原。',
          action: null,
        };
      case 'shared':
        return {
          title: '尚無他人共享的手帳空間',
          desc: '輸入同伴分享的邀請碼即可共同協作，隨時激盪靈感！',
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
          title: '尚未有任何空間記錄',
          desc: '點擊下方按鈕建立全新空間，或是加入團隊分享的手帳本！',
          action: onCreateSpaceClick,
          actionText: '建立新空間',
        };
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col justify-between min-h-[calc(100vh-110px)] animate-fadeIn">
      {/* 頂部主體：側邊欄導覽與工作空間內容區 */}
      <div className="flex-1 w-full flex flex-col md:flex-row items-stretch gap-5 lg:gap-7">
        {/* ========================================================
          行動端快速導覽分類條 (Mobile Adaptive Category Bar)
          ======================================================== */}
      <div className="md:hidden space-y-3 bg-[var(--card-bg)] p-3.5 rounded-2xl border border-[var(--line)] shadow-xs">
        {/* 行動端名片與問候 (點擊可開啟帳號設定) */}
        <div className="flex items-center justify-between gap-3">
          <div
            onClick={() => onOpenSettings && onOpenSettings(null, 'account')}
            role="button"
            tabIndex={0}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
            title="點擊前往個人帳號設定"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--coral-light)] border border-[var(--coral-border)] flex items-center justify-center text-[var(--coral)] font-bold text-sm shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              {displayName.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h2 className="text-xs font-bold text-[var(--ink)] truncate group-hover:text-[var(--coral)] transition-colors">
                  您好，{displayName}
                </h2>
                <User size={11} className="text-[var(--muted)] group-hover:text-[var(--coral)] shrink-0" />
              </div>
              <span className="text-[10px] text-[var(--coral)] font-medium">{todayGreeting}</span>
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
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋手帳或空間…"
            className="notebook-input notebook-input-search w-full text-xs pl-7 py-1.5"
          />
        </div>

        {/* 核心分類橫向切換藥丸列 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setActiveNav('recent')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              activeNav === 'recent'
                ? 'bg-[var(--coral-light)] text-[var(--coral)] font-bold shadow-xs'
                : 'bg-[var(--paper)] text-[var(--ink)]'
            }`}
          >
            <Clock size={13} />
            <span>最近 ({recentSpaces.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveNav('templates')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              activeNav === 'templates'
                ? 'bg-[var(--coral-light)] text-[var(--coral)] font-bold shadow-xs'
                : 'bg-[var(--paper)] text-[var(--ink)]'
            }`}
          >
            <BookTemplate size={13} />
            <span>範本專區 ({TOOL_TEMPLATES.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveNav('owned')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              activeNav === 'owned'
                ? 'bg-[var(--coral-light)] text-[var(--coral)] font-bold shadow-xs'
                : 'bg-[var(--paper)] text-[var(--ink)]'
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
                ? 'bg-[var(--coral-light)] text-[var(--coral)] font-bold shadow-xs'
                : 'bg-[var(--paper)] text-[var(--ink)]'
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
                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-bold shadow-xs border border-amber-200/50'
                : 'bg-[var(--paper)] text-[var(--ink)]'
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
                ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold shadow-xs border border-red-200/50'
                : 'bg-[var(--paper)] text-[var(--muted)]'
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
            className="notebook-card p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:border-[var(--coral-border)] hover:bg-[var(--coral-light)] transition-all group shadow-xs relative overflow-hidden"
            title="點擊前往個人帳號設定"
          >
            {/* 背景手帳火漆封蠟飾紋 */}
            <div className="absolute right-16 top-1 pointer-events-none opacity-25 dark:opacity-15 transition-transform group-hover:scale-110">
              <WaxSealDoodle className="w-9 h-9" />
            </div>

            <div className="flex items-center gap-3 min-w-0 z-10">
              <div className="w-10 h-10 rounded-xl bg-[var(--coral-light)] border border-[var(--coral-border)] flex items-center justify-center text-[var(--coral)] font-bold text-base shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                {displayName.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-[var(--ink)] truncate group-hover:text-[var(--coral)] transition-colors">
                  您好，{displayName}
                </h2>
                <p className="text-[11px] text-[var(--coral)] font-medium flex items-center gap-1">
                  <span>{todayGreeting}</span>
                </p>
              </div>
            </div>
            <span className="text-[11px] px-2 py-1 rounded-lg bg-[var(--paper)] text-[var(--muted)] group-hover:bg-[var(--card-bg)] group-hover:text-[var(--coral)] transition-colors flex items-center gap-1 shrink-0">
              <User size={12} />
              <span>帳號</span>
            </span>
          </div>

          {/* 搜尋空間輸入框 */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋手帳或空間…"
              className="notebook-input notebook-input-search w-full text-xs pl-8 py-2"
            />
          </div>

          {/* 5 大核心分類導覽清單 */}
          <nav className="space-y-1 bg-[var(--card-bg)] p-2 rounded-2xl border border-[var(--line)] shadow-xs">
            {/* 1. 最近使用 */}
            <button
              type="button"
              onClick={() => setActiveNav('recent')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'recent'
                  ? 'bg-[var(--coral-light)] text-[var(--coral)] font-bold shadow-xs'
                  : 'text-[var(--ink)] hover:bg-[var(--paper)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock size={15} className={activeNav === 'recent' ? 'text-[var(--coral)]' : 'text-[var(--muted)]'} />
                <span>最近使用</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[var(--card-bg)]/80 border border-current/20 text-current">
                {recentSpaces.length}
              </span>
            </button>

            {/* 範本專區 */}
            <button
              type="button"
              onClick={() => setActiveNav('templates')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'templates'
                  ? 'bg-[var(--coral-light)] text-[var(--coral)] font-bold shadow-xs'
                  : 'text-[var(--ink)] hover:bg-[var(--paper)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookTemplate size={15} className={activeNav === 'templates' ? 'text-[var(--coral)]' : 'text-[var(--muted)]'} />
                <span>範本專區</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[var(--card-bg)]/80 border border-current/20 text-current">
                {TOOL_TEMPLATES.length}
              </span>
            </button>

            {/* 2. 由我建立 */}
            <button
              type="button"
              onClick={() => setActiveNav('owned')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'owned'
                  ? 'bg-[var(--coral-light)] text-[var(--coral)] font-bold shadow-xs'
                  : 'text-[var(--ink)] hover:bg-[var(--paper)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderHeart size={15} className={activeNav === 'owned' ? 'text-[var(--coral)]' : 'text-[var(--muted)]'} />
                <span>由我建立</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[var(--card-bg)]/80 border border-current/20 text-current">
                {ownedSpaces.length}
              </span>
            </button>

            {/* 3. 他人共享 */}
            <button
              type="button"
              onClick={() => setActiveNav('shared')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'shared'
                  ? 'bg-[var(--coral-light)] text-[var(--coral)] font-bold shadow-xs'
                  : 'text-[var(--ink)] hover:bg-[var(--paper)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users size={15} className={activeNav === 'shared' ? 'text-[var(--coral)]' : 'text-[var(--muted)]'} />
                <span>他人共享</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[var(--card-bg)]/80 border border-current/20 text-current">
                {sharedSpaces.length}
              </span>
            </button>

            {/* 4. 我的最愛 */}
            <button
              type="button"
              onClick={() => setActiveNav('favorites')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'favorites'
                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-bold shadow-xs border border-amber-200/50'
                  : 'text-[var(--ink)] hover:bg-[var(--paper)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star
                  size={15}
                  className={activeNav === 'favorites' ? 'text-amber-500 fill-amber-500' : 'text-[var(--muted)]'}
                />
                <span>我的最愛</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[var(--card-bg)]/80 border border-current/20 text-current">
                {favoriteSpaces.length}
              </span>
            </button>

            {/* 5. 資源回收桶 */}
            <button
              type="button"
              onClick={() => setActiveNav('trash')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'trash'
                  ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold shadow-xs border border-red-200/50'
                  : 'text-[var(--muted)] hover:text-red-500 hover:bg-red-50/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Trash2 size={15} className={activeNav === 'trash' ? 'text-red-500' : 'text-[var(--muted)]'} />
                <span>資源回收桶</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[var(--card-bg)]/80 border border-current/20 text-current">
                {trashSpaces.length}
              </span>
            </button>

            {/* 分隔線與偏好設定群組 */}
            <div className="pt-2 pb-1 px-3">
              <div className="h-[1px] bg-[var(--line)] mb-2" />
              <span className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                偏好與管理
              </span>
            </div>

            {/* 帳號設定入口 */}
            <button
              type="button"
              onClick={() => onOpenSettings && onOpenSettings(null, 'account')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[var(--ink)] hover:bg-[var(--paper)] hover:text-[var(--coral)] transition-all"
              title="修改顯示暱稱與帳號資訊"
            >
              <div className="flex items-center gap-2.5">
                <User size={15} className="text-[#3b827e]" />
                <span>帳號設定</span>
              </div>
              <span className="text-[10px] text-[var(--muted)]">個人資料</span>
            </button>

            {/* 偏好與外觀入口 */}
            <button
              type="button"
              onClick={() => onOpenSettings && onOpenSettings(null, 'appearance')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[var(--ink)] hover:bg-[var(--paper)] hover:text-[var(--coral)] transition-all"
              title="主題紙質與預設偏好"
            >
              <div className="flex items-center gap-2.5">
                <Settings size={15} className="text-[var(--coral)]" />
                <span>偏好與外觀</span>
              </div>
              <span className="text-[10px] text-[var(--muted)]">主題紙質</span>
            </button>
          </nav>
        </div>

        {/* 側邊欄底部配額卡片 */}
        <div className="p-3.5 rounded-2xl bg-[var(--paper)] border border-[var(--line)] text-xs space-y-1.5 overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[var(--ink)]">手帳工作空間</span>
            <span className="notebook-badge bg-[var(--card-bg)] text-[10px] text-[var(--muted)]">已啟用</span>
          </div>
          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            已使用 {ownedSpaces.length} 個由您建立的空間，無限無拘束自由編排。
          </p>
          <div className="pt-0.5 flex justify-center">
            <BookshelfDoodle className="w-full h-8 opacity-65 dark:opacity-45 text-[var(--ink)]" />
          </div>
        </div>
      </aside>

      {/* ========================================================
          右側工作空間主內容區 (Main Content Area)
          ======================================================== */}
      <section className="flex-1 min-w-0 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          {/* 主標題與排序切換列 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[var(--line)]">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-[var(--ink)] flex items-center gap-2">
                <span>{getNavTitle()}</span>
              </h1>
              <span className="notebook-badge text-xs">
                {activeNav === 'templates' ? `${filteredTemplates.length} 款小工具範本` : `${displayedSpaces.length} 個手帳空間`}
              </span>
            </div>

            {activeNav === 'templates' ? (
              /* 範本分類切換藥丸 */
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1 scrollbar-none">
                {['all', '效能與專注', '靈感與創意', '實用工具', '生活日常'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setTemplateCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                      templateCategory === cat
                        ? 'bg-[var(--coral-light)] text-[var(--coral)] font-bold shadow-xs'
                        : 'bg-[var(--card-bg)] text-[var(--muted)] hover:text-[var(--ink)] border border-[var(--line)]'
                    }`}
                  >
                    {cat === 'all' ? '全部範本' : cat}
                  </button>
                ))}
              </div>
            ) : (
              /* 排序方式切換 */
              <div className="flex items-center gap-1 bg-[var(--card-bg)] p-1 rounded-xl border border-[var(--line)] text-xs">
                <button
                  type="button"
                  onClick={() => setSortBy('recent')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    sortBy === 'recent'
                      ? 'bg-[var(--coral-light)] text-[var(--coral)] font-bold shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  修改日期
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('name')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    sortBy === 'name'
                      ? 'bg-[var(--coral-light)] text-[var(--coral)] font-bold shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  名稱 A-Z
                </button>
              </div>
            )}
          </div>

          {/* 範本專區視圖 vs 空間卡片視圖 */}
          {activeNav === 'templates' ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--card-bg)] p-4 rounded-2xl border border-[var(--line)] shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-[var(--ink)]">手帳小工具範本工坊</h3>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    點擊試玩可即時在隔離沙盒中操作，亦可一鍵分派至任何手帳空間或以此範本建立新空間。
                  </p>
                </div>
                <div className="relative w-full sm:w-64 shrink-0">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
                  <input
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="搜尋範本名稱或描述…"
                    className="notebook-input w-full text-xs pl-7 py-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredTemplates.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="notebook-card p-5 flex flex-col justify-between hover:shadow-md transition-all group border border-[var(--line)] bg-[var(--card-bg)] relative"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="notebook-badge bg-[var(--coral-light)] text-[var(--coral)] border-[var(--coral-border)] text-[10px]">
                          {tmpl.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--paper)] text-[var(--muted)] border border-[var(--line)]">
                          {tmpl.defaultColSpan === 2 ? '寬欄 2x' : '標準 1x'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[var(--ink)] group-hover:text-[var(--coral)] transition-colors">
                          {tmpl.title}
                        </h3>
                        <p className="text-xs text-[var(--muted)] mt-1.5 line-clamp-2 leading-relaxed">
                          {tmpl.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[var(--line)] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewingTemplate(tmpl)}
                        className="notebook-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 text-[var(--ink)]"
                        title="即時在沙盒中預覽操作"
                      >
                        <Play size={12} className="text-[#3b827e]" />
                        <span>試玩預覽</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setTargetSpaceSelectTmpl(tmpl)}
                          className="notebook-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 text-[var(--coral)]"
                          title="加入至現有空間"
                        >
                          <Plus size={12} />
                          <span>加入空間</span>
                        </button>
                        {onCreateSpaceFromTemplate && (
                          <button
                            type="button"
                            onClick={() => onCreateSpaceFromTemplate(tmpl)}
                            className="notebook-btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                            title="以此範本建立新空間"
                          >
                            <FolderPlus size={12} />
                            <span>以此建空間</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : displayedSpaces.length > 0 ? (
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
                    {/* 卡片頂部封面底紋 (支援深淺自適應，深色模式低飽和沉穩優雅) */}
                    <div
                      className={`dashboard-cover dashboard-cover-pattern cover-theme-${isTrashItem ? 'trash' : idx % 6} relative overflow-hidden`}
                    >
                      {/* 封面專屬手繪飾紋插畫 */}
                      <div className="absolute right-14 top-1.5 w-16 h-11 pointer-events-none opacity-45 dark:opacity-35 transition-transform group-hover:scale-105">
                        <CoverDoodle themeIndex={idx} isTrash={isTrashItem} className="w-full h-full" />
                      </div>

                      {/* 佈局模式徽章與封存徽章 */}
                      <div className="flex items-center gap-1.5 z-10">
                        <span className="notebook-badge bg-[var(--card-bg)]/90 backdrop-blur text-[11px] shadow-xs flex items-center gap-1">
                          {layoutInfo.icon}
                          <span>{layoutInfo.label}</span>
                        </span>
                        {archivedSpaceIds.includes(sp.id) && (
                          <span className="notebook-badge bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] shadow-xs font-semibold">
                            已封存
                          </span>
                        )}
                      </div>

                      {/* 右上角快捷操作：加星號、空間設定或更多選單 */}
                      <div className="flex items-center gap-1.5 z-10" onClick={(e) => e.stopPropagation()}>
                        {!isTrashItem && (
                          <>
                            <button
                              type="button"
                              onClick={() => onToggleFavorite && onToggleFavorite(sp.id)}
                              className={`p-1.5 rounded-lg transition-all ${
                                isFavorite
                                  ? 'text-amber-500 bg-[var(--card-bg)]/90 shadow-xs'
                                  : 'text-[var(--muted)] hover:text-amber-500 hover:bg-[var(--card-bg)]/90'
                              }`}
                              title={isFavorite ? '從我的最愛移除' : '加入我的最愛'}
                            >
                              <Star size={15} className={isFavorite ? 'fill-amber-400 text-amber-500' : ''} />
                            </button>

                            {onOpenSettings && (
                              <button
                                type="button"
                                onClick={() => onOpenSettings(sp, 'info')}
                                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--coral)] hover:bg-[var(--card-bg)]/90 transition-all shadow-xs"
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
                            className="p-1.5 rounded-lg bg-[var(--card-bg)]/80 hover:bg-[var(--card-bg)] text-[var(--muted)] hover:text-[var(--ink)] shadow-xs transition-colors"
                          >
                            <MoreVertical size={14} />
                          </button>

                          {activeMenuSpaceId === sp.id && (
                            <div
                              className="absolute right-0 mt-1 w-44 bg-[var(--card-bg)] rounded-xl border border-[var(--line)] shadow-xl z-30 p-1 animate-fadeIn text-xs"
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
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--paper)] flex items-center gap-2 text-[var(--ink)]"
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
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--paper)] flex items-center gap-2 text-[var(--ink)]"
                                    >
                                      <Settings size={13} className="text-[var(--coral)]" />
                                      <span>空間設定</span>
                                    </button>
                                  )}

                                  {isOwner && onToggleArchive && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveMenuSpaceId(null);
                                        onToggleArchive(sp.id);
                                      }}
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--paper)] flex items-center gap-2 text-[var(--ink)]"
                                    >
                                      <Archive size={13} className="text-amber-500" />
                                      <span>{archivedSpaceIds.includes(sp.id) ? '解除空間封存' : '封存空間'}</span>
                                    </button>
                                  )}

                                  {isOwner && onMoveToTrash && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveMenuSpaceId(null);
                                        onMoveToTrash(sp.id);
                                      }}
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 flex items-center gap-2"
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
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-600 flex items-center gap-2 font-medium"
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
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 flex items-center gap-2 font-medium"
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
                          <h3 className="font-bold text-sm text-[var(--ink)] group-hover:text-[var(--coral)] transition-colors truncate">
                            {sp.name}
                          </h3>
                        </div>
                        <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                          {sp.description || '點擊進入空間查看自訂工具與手帳內容…'}
                        </p>
                      </div>

                      {/* 底部元數據與快捷邀請碼 */}
                      <div className="pt-2 border-t border-[var(--line)]/60 flex items-center justify-between text-[11px] text-[var(--muted)]">
                        <div className="flex items-center gap-2">
                          <span className="notebook-badge bg-[var(--paper)] border-none text-[10px] px-1.5 py-0.5">
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
                            <span className="text-[var(--line)]">|</span>
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
                            className="flex items-center gap-1 hover:text-[var(--coral)] transition-colors font-mono"
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
                  className="dashboard-create-card min-h-[190px] flex flex-col items-center justify-center p-6 text-center gap-2 text-[var(--coral)] group"
                >
                  <div className="p-2.5 rounded-2xl bg-[var(--coral-light)] border border-[var(--coral-border)] flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 group-hover:rotate-3">
                    <CreateSpaceDoodle className="w-12 h-12" />
                  </div>
                  <div className="text-xs font-bold text-[var(--ink)] group-hover:text-[var(--coral)] transition-colors">建立新手帳空間</div>
                  <div className="text-[11px] text-[var(--muted)] max-w-[160px]">
                    自訂分欄貨架、嵌入課堂或工作小工具
                  </div>
                </button>
              )}
            </div>
          ) : (
            /* 無資料時的手繪風空狀態插畫卡片 */
            <div className="p-8 sm:p-14 notebook-card bg-[var(--card-bg)] text-center space-y-3 flex flex-col items-center justify-center min-h-[360px] animate-fadeIn">
              {renderEmptyIllustration()}
              <h3 className="text-base font-bold text-[var(--ink)]">
                {getNavEmptyMessage().title}
              </h3>
              <p className="text-xs text-[var(--muted)] max-w-md leading-relaxed">
                {getNavEmptyMessage().desc}
              </p>
              {getNavEmptyMessage().action && (
                <button
                  type="button"
                  onClick={getNavEmptyMessage().action}
                  className="notebook-btn-primary text-xs py-2 px-5 mt-2 shadow-xs hover:scale-105 transition-transform"
                >
                  {getNavEmptyMessage().actionText}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>

    {/* 底部精緻手繪風全景天際線：全寬展開、完全貼近頁底 */}
    <div className="pt-6 w-full -mb-4 sm:-mb-6 flex justify-center items-end pointer-events-none overflow-hidden">
      <PanoramicSkyline className="w-full max-w-[1700px] h-28 sm:h-36 md:h-48 lg:h-56 text-[var(--ink)] opacity-45 dark:opacity-30 pointer-events-none transition-opacity" />
    </div>

    {/* 範本小工具即時試玩預覽彈窗 */}
    {previewingTemplate && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11151a]/60 backdrop-blur-sm animate-fadeIn">
        <div className="notebook-modal-box w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[var(--paper)]/40">
            <div className="flex items-center gap-3">
              <div className="notebook-modal-badge text-[var(--coral)]">
                <BookTemplate size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--ink)]">{previewingTemplate.title}</h3>
                <p className="text-[11px] text-[var(--muted)]">{previewingTemplate.category} - 獨立沙盒即時試玩</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPreviewingTemplate(null)}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--card-bg)] rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 w-full bg-[var(--paper)] p-3 overflow-hidden">
            <SandboxedFrame htmlContent={previewingTemplate.content} title={previewingTemplate.title} />
          </div>
          <div className="px-6 py-3 border-t border-[var(--line)] bg-[var(--card-bg)] flex items-center justify-between">
            <span className="text-[11px] text-[var(--muted)]">試玩中所有操作皆在隔離沙盒中運行</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const tmpl = previewingTemplate;
                  setPreviewingTemplate(null);
                  setTargetSpaceSelectTmpl(tmpl);
                }}
                className="notebook-btn-secondary text-xs py-1.5 px-3"
              >
                加入至手帳空間...
              </button>
              {onCreateSpaceFromTemplate && (
                <button
                  type="button"
                  onClick={() => {
                    const tmpl = previewingTemplate;
                    setPreviewingTemplate(null);
                    onCreateSpaceFromTemplate(tmpl);
                  }}
                  className="notebook-btn-primary text-xs py-1.5 px-3"
                >
                  以此範本新建空間
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* 將範本分派至指定手帳空間彈窗 */}
    {targetSpaceSelectTmpl && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11151a]/60 backdrop-blur-sm animate-fadeIn">
        <div className="notebook-modal-box w-full max-w-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="notebook-modal-badge text-[var(--coral)]">
                <Send size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--ink)]">加入至手帳空間</h3>
                <p className="text-[11px] text-[var(--muted)]">選擇將「{targetSpaceSelectTmpl.title}」放入哪一個空間</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTargetSpaceSelectTmpl(null)}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {activeSpaces.length === 0 ? (
              <p className="text-xs text-[var(--muted)] text-center py-4">目前尚無可用的手帳空間</p>
            ) : (
              activeSpaces.map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={async () => {
                    if (onAddTemplateToSpace) {
                      await onAddTemplateToSpace(sp.id, targetSpaceSelectTmpl);
                      setTargetSpaceSelectTmpl(null);
                    }
                  }}
                  className="w-full p-3 rounded-xl border border-[var(--line)] bg-[var(--paper)]/50 hover:bg-[var(--coral-light)] hover:border-[var(--coral-border)] text-left flex items-center justify-between transition-all group"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="text-xs font-bold text-[var(--ink)] group-hover:text-[var(--coral)] truncate">{sp.name}</div>
                    <div className="text-[10px] text-[var(--muted)] truncate">{sp.description || '無備註說明'}</div>
                  </div>
                  <span className="notebook-badge text-[10px] bg-[var(--card-bg)] text-[var(--muted)] shrink-0">加入</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    )}
  </div>
);
}
