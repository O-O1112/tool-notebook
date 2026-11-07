import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Share2,
  ShieldCheck,
  Users,
  Tv,
  LayoutGrid,
  Check,
  ChevronRight,
  Code,
  Globe,
  ExternalLink,
  Layers,
  Columns2,
  Sun,
  Moon,
  Clock,
  Palette,
  FileCode,
  FolderOpen,
  Play,
  Copy,
  Kanban,
  Columns3,
  ListCollapse,
  Maximize2,
  X,
  RotateCcw,
  Lock,
  Laptop,
} from 'lucide-react';
import SandboxedFrame from './SandboxedFrame';
import { TOOL_TEMPLATES } from '../utils/toolTemplates';
import {
  WashiTapePinDoodle,
  PanoramicSkyline,
  DraftingNotebookDoodle,
  CraftStudioDoodle,
} from './Illustrations';

// 首頁 Hero 快速切換實境試玩工具清單
const HERO_PLAYGROUND_TOOLS = [
  { id: 0, label: '番茄專注鐘', index: 0 },
  { id: 1, label: '隨手便箋', index: 2 },
  { id: 2, label: '決策轉盤', index: 1 },
  { id: 3, label: '極簡計算機', index: 4 },
  { id: 4, label: '塗鴉白板', index: 3 },
];

export default function LandingView({
  user,
  onGoToDashboard,
  onOpenLoginModal,
  theme = 'warm',
  onToggleDarkMode,
}) {
  const [activeHeroToolIdx, setActiveHeroToolIdx] = useState(0);
  const [activeModeTab, setActiveModeTab] = useState('single'); // 'single' | 'tabs' | 'split'
  const [activeLayoutTab, setActiveLayoutTab] = useState('shelf');
  const [templateFilterCategory, setTemplateFilterCategory] = useState('all');
  const [previewingTemplate, setPreviewingTemplate] = useState(null);
  const [copiedEmbedSnippet, setCopiedEmbedSnippet] = useState(false);

  // 模式 2 互動模擬門戶分頁狀態
  const [mockPortalTab, setMockPortalTab] = useState(0);

  const heroTool = TOOL_TEMPLATES[activeHeroToolIdx] || TOOL_TEMPLATES[0];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyIframeSnippet = () => {
    const snippet = `<iframe src="https://o-o1112.github.io/tool-notebook/?host=HOST-DEMO&embed=true" width="100%" height="560" frameborder="0" allow="clipboard-write" sandbox="allow-scripts allow-forms allow-popups allow-modals"></iframe>`;
    navigator.clipboard.writeText(snippet);
    setCopiedEmbedSnippet(true);
    setTimeout(() => setCopiedEmbedSnippet(false), 2000);
  };

  // 範本過濾
  const filteredTemplates = TOOL_TEMPLATES.filter((t) => {
    if (templateFilterCategory === 'all') return true;
    return t.category === templateFilterCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] select-none">
      {/* ======================================================== */}
      {/* 頂部導覽列 (Landing Header)                              */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-[var(--card-bg)]/90 backdrop-blur-md border-b border-[var(--line)] px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* 左側：品牌標識與簡述 */}
          <div className="flex items-center gap-3">
            <div className="brand-mark shadow-xs">
              <BookOpen size={18} />
            </div>
            <div>
              <span className="font-bold text-base text-[var(--ink)] block leading-tight">
                工具小本本
              </span>
              <span className="text-[10px] text-[var(--muted)] hidden sm:block">
                自訂微應用與手帳空間
              </span>
            </div>
          </div>

          {/* 中間：快速錨點導覽 (大螢幕可見) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs text-[var(--muted)] font-medium">
            <button
              type="button"
              onClick={() => scrollToSection('section-modes')}
              className="hover:text-[var(--coral)] transition-colors"
            >
              三大代管模式
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('section-layouts')}
              className="hover:text-[var(--coral)] transition-colors"
            >
              五大排版檢視
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('section-features')}
              className="hover:text-[var(--coral)] transition-colors"
            >
              核心特色
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('section-templates')}
              className="hover:text-[var(--coral)] transition-colors"
            >
              精選範本 ({TOOL_TEMPLATES.length})
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('section-faq')}
              className="hover:text-[var(--coral)] transition-colors"
            >
              常見問題
            </button>
          </nav>

          {/* 右側：深色模式與進入工作區按鈕 */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="notebook-btn-secondary text-xs p-2 flex items-center justify-center shrink-0"
              title={theme === 'dark' ? '切換為日間手帳模式' : '切換為深邃夜墨模式'}
            >
              {theme === 'dark' ? (
                <Sun size={15} className="text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon size={15} className="text-[var(--muted)] hover:-rotate-12 transition-transform" />
              )}
            </button>

            {user ? (
              <button
                type="button"
                onClick={onGoToDashboard}
                className="notebook-btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-xs font-semibold"
              >
                <span>進入工作空間</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenLoginModal(false)}
                  className="notebook-btn-secondary text-xs py-2 px-3 font-semibold text-[var(--ink)]"
                >
                  登入
                </button>
                <button
                  type="button"
                  onClick={() => onOpenLoginModal(true)}
                  className="notebook-btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-xs font-semibold"
                >
                  <span>免費註冊</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 1. Hero 視覺震撼實境區 (互動工具切換與即時沙盒試玩)        */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* 左側：文案與行動呼籲 */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--coral-light)] border border-[var(--coral-border)] text-[var(--coral)] text-xs font-bold tracking-wide shadow-xs">
              <Sparkles size={14} />
              <span>自訂代碼 x 獨立代管 x 團隊手帳空間</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--ink)] tracking-tight leading-tight">
              自訂程式與實用微應用的
              <br />
              <span className="text-[var(--coral)]">專屬手帳空間</span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed max-w-xl mx-auto lg:mx-0">
              將 HTML/JS 自製代碼、外部 Iframe 網頁或工具，整齊收納在質感手帳本中。支援一鍵打包為全螢幕獨立運行之代管微應用，支援三人協作、大螢幕簡報與即時討論。
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                type="button"
                onClick={() => (user ? onGoToDashboard() : onOpenLoginModal(true))}
                className="notebook-btn-primary py-3 px-6 text-sm flex items-center gap-2 shadow-md hover:scale-[1.02] transition-transform font-bold"
              >
                <span>免費開始使用</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('section-modes')}
                className="notebook-btn-secondary py-3 px-5 text-sm font-semibold hover:border-[var(--coral)] transition-colors"
              >
                探索三大代管模式
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('section-templates')}
                className="notebook-btn-secondary py-3 px-4 text-sm text-[var(--muted)] hover:text-[var(--ink)]"
              >
                瀏覽 23 款精選範本
              </button>
            </div>

            {/* 核心認證指標徽章 */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-[var(--muted)] font-medium">
              <div className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-500 stroke-[3]" />
                <span>23 款內建離線範本</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-500 stroke-[3]" />
                <span>3 大獨立代管模式</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-500 stroke-[3]" />
                <span>100% 沙盒零信任隔離</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-500 stroke-[3]" />
                <span>大螢幕投影展示 (Shift+P)</span>
              </div>
            </div>
          </div>

          {/* 右側：可即刻操作的微應用實境切換沙盒卡片 */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <div className="notebook-card p-4 sm:p-5 shadow-2xl relative border-2 border-[var(--coral-border)] bg-[var(--card-bg)]">
              {/* 置頂和紙膠帶飾紋 */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                <WashiTapePinDoodle className="w-24 h-6 text-[var(--coral)]" />
              </div>

              {/* 即時工具切換膠囊按鈕帶 (Hero Playground Selector) */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--line)] gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                  {HERO_PLAYGROUND_TOOLS.map((pt) => {
                    const active = activeHeroToolIdx === pt.index;
                    return (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => setActiveHeroToolIdx(pt.index)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                          active
                            ? 'bg-[var(--coral)] text-white shadow-xs'
                            : 'bg-[var(--paper)] text-[var(--muted)] hover:text-[var(--ink)]'
                        }`}
                      >
                        {pt.label}
                      </button>
                    );
                  })}
                </div>

                <span className="text-[10px] text-[var(--muted)] font-mono shrink-0">
                  沙盒即時運行中
                </span>
              </div>

              {/* 沙盒運行容器 (訪客可直接操作、計時、點擊轉盤、隨手筆記) */}
              <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--paper)]">
                <SandboxedFrame
                  code={heroTool.content}
                  title={heroTool.title}
                  className="w-full h-full min-h-0"
                />
              </div>

              {/* 沙盒底部引導與快捷按鈕 */}
              <div className="mt-3 pt-2 flex items-center justify-between text-xs text-[var(--muted)]">
                <span className="text-[11px] truncate pr-2">
                  零安裝 • 免本機環境 • 貼上代碼即可安全沙盒運行
                </span>
                <button
                  type="button"
                  onClick={() => (user ? onGoToDashboard() : onOpenLoginModal(true))}
                  className="text-[var(--coral)] font-semibold hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>立即建立您的手帳</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. 三大微應用代管發布模式 (實境視覺擬真展示)            */}
      {/* ======================================================== */}
      <section id="section-modes" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[var(--line)] bg-[var(--card-bg)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="notebook-badge text-[11px] font-bold text-[var(--coral)] bg-[var(--coral-light)] border-[var(--coral-border)]">
              核心亮點功能
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
              三大微應用獨立代管發布模式
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              將空間內製作的小工具一鍵打包為專屬代碼網址，使用者無需進入管理後台，即可享受 100% 滿版獨立運行或無縫嵌入任何網站。
            </p>
          </div>

          {/* 模式切換 Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 rounded-2xl bg-[var(--paper)] border border-[var(--line)] text-xs font-semibold shadow-xs">
              <button
                type="button"
                onClick={() => setActiveModeTab('single')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeModeTab === 'single'
                    ? 'bg-[var(--card-bg)] text-[var(--coral)] shadow-xs font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <ExternalLink size={14} />
                <span>模式 1：單一小工具獨立代管</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModeTab('tabs')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeModeTab === 'tabs'
                    ? 'bg-[var(--card-bg)] text-[var(--coral)] shadow-xs font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <Layers size={14} />
                <span>模式 2：指定多工具客製分頁門戶</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModeTab('split')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeModeTab === 'split'
                    ? 'bg-[var(--card-bg)] text-[var(--coral)] shadow-xs font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <Code size={14} />
                <span>模式 3：外部網站無縫嵌入 (iframe)</span>
              </button>
            </div>
          </div>

          {/* 模式擬真視窗展示區 */}
          <div className="max-w-4xl mx-auto notebook-card p-5 sm:p-7 bg-[var(--paper)] border border-[var(--line)] shadow-xl space-y-6">
            {activeModeTab === 'single' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
                  <div>
                    <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--coral)]" />
                      模式 1：單一小工具全螢幕獨立運行
                    </h3>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      專屬獨立代碼網址直達，100% 全視窗沉浸操作，無任何後台管理介面干擾。
                    </p>
                  </div>
                  <span className="notebook-badge bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-200 text-xs">
                    專屬 HOST 網址直達
                  </span>
                </div>

                {/* 瀏覽器擬真視窗 */}
                <div className="rounded-xl border border-[var(--line)] bg-[var(--card-bg)] shadow-md overflow-hidden">
                  <div className="px-3 py-2 bg-[var(--paper)] border-b border-[var(--line)] flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex-1 max-w-sm mx-auto px-3 py-0.5 rounded-md bg-[var(--card-bg)] border border-[var(--line)] text-[10px] font-mono text-[var(--muted)] text-center truncate">
                      https://o-o1112.github.io/tool-notebook/?host=HOST-POMO25
                    </div>
                  </div>

                  <div className="relative h-64 sm:h-72 w-full p-0">
                    <SandboxedFrame
                      code={TOOL_TEMPLATES[0].content}
                      title="模式 1 擬真展示"
                      className="w-full h-full min-h-0 border-0"
                    />

                    {/* 右下角浮動作者微型膠囊 */}
                    <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--card-bg)]/90 backdrop-blur border border-[var(--line)] shadow-lg text-[10px] text-[var(--ink)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--coral)]" />
                      <span className="font-bold">番茄專注鐘</span>
                      <span className="text-[var(--muted)]">• 123 的手帳</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1">
                    <div className="font-bold text-[var(--ink)]">極簡全版專注</div>
                    <div className="text-[var(--muted)]">隱藏所有工具列，使用者僅與小工具本身互動。</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1">
                    <div className="font-bold text-[var(--ink)]">免登入即開即用</div>
                    <div className="text-[var(--muted)]">任何人點開連結即可在瀏覽器獨立運行。</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1">
                    <div className="font-bold text-[var(--ink)]">作品成果交付</div>
                    <div className="text-[var(--muted)]">適合將課堂作業或自製微應用發布給他人使用。</div>
                  </div>
                </div>
              </div>
            )}

            {activeModeTab === 'tabs' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
                  <div>
                    <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      模式 2：指定多工具加上高度客製化分頁
                    </h3>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      打包多個工具，為每個分頁自訂中文標籤，訪客點擊切換時狀態不中斷。
                    </p>
                  </div>
                  <span className="notebook-badge bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 border-indigo-200 text-xs">
                    多功能門戶網站
                  </span>
                </div>

                {/* 擬真多分頁門戶視窗 (可實際點擊切換分頁) */}
                <div className="rounded-xl border border-[var(--line)] bg-[var(--card-bg)] shadow-md overflow-hidden">
                  <div className="px-3 py-2 bg-[var(--paper)] border-b border-[var(--line)] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--coral)]" />
                      <span className="text-xs font-bold text-[var(--ink)]">我的自製生產力工具箱</span>
                    </div>

                    {/* 可互動點擊的客製分頁標籤 */}
                    <div className="flex items-center gap-1">
                      {['專注碼錶', '隨手便箋', '極簡計算器'].map((tabName, idx) => (
                        <button
                          key={tabName}
                          type="button"
                          onClick={() => setMockPortalTab(idx)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            mockPortalTab === idx
                              ? 'bg-[var(--coral)] text-white shadow-xs'
                              : 'bg-[var(--card-bg)] text-[var(--muted)] hover:text-[var(--ink)] border border-[var(--line)]'
                          }`}
                        >
                          {tabName}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-64 sm:h-72 w-full p-0">
                    <SandboxedFrame
                      code={TOOL_TEMPLATES[mockPortalTab === 0 ? 0 : mockPortalTab === 1 ? 2 : 4].content}
                      title="模式 2 擬真展示"
                      className="w-full h-full min-h-0 border-0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1">
                    <div className="font-bold text-[var(--ink)]">自訂中文標籤</div>
                    <div className="text-[var(--muted)]">自由為每個微應用命名專屬分頁名稱。</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1">
                    <div className="font-bold text-[var(--ink)]">雙欄對照支援</div>
                    <div className="text-[var(--muted)]">支援分屏左右並排檢視，對照運算更加順手。</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1">
                    <div className="font-bold text-[var(--ink)]">手機自適應</div>
                    <div className="text-[var(--muted)]">行動裝置自動轉為滑動式分頁列，體驗流暢。</div>
                  </div>
                </div>
              </div>
            )}

            {activeModeTab === 'split' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
                  <div>
                    <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                      模式 3：外部網站無縫嵌入 (iframe 整合)
                    </h3>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      自動去除介面外框，一鍵複製標準語法，原生融入 Notion、WordPress、靜態站或教學平台。
                    </p>
                  </div>
                  <span className="notebook-badge bg-teal-50 dark:bg-teal-950/30 text-teal-600 border-teal-200 text-xs">
                    原生嵌入整合
                  </span>
                </div>

                {/* 擬真 Notion 文件頁面嵌入情境 */}
                <div className="rounded-xl border border-[var(--line)] bg-[var(--card-bg)] shadow-md p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-[var(--coral)]" />
                      <span className="text-xs font-bold text-[var(--ink)]">Notion 筆記：每日工作與學習儀表板</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyIframeSnippet}
                      className="notebook-btn-primary text-xs py-1 px-3 flex items-center gap-1.5 font-bold"
                    >
                      {copiedEmbedSnippet ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedEmbedSnippet ? '已複製語法！' : '一鍵複製 iframe 語法'}</span>
                    </button>
                  </div>

                  {/* 嵌入語法代碼預覽 */}
                  <pre className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] text-[11px] font-mono text-[var(--ink)] overflow-x-auto whitespace-pre-wrap select-all">
                    {`<iframe src="https://o-o1112.github.io/tool-notebook/?host=HOST-DEMO&embed=true" width="100%" height="560" frameborder="0" allow="clipboard-write" sandbox="allow-scripts allow-forms allow-popups allow-modals"></iframe>`}
                  </pre>

                  <div className="h-56 w-full rounded-xl overflow-hidden border border-[var(--line)]">
                    <SandboxedFrame
                      code={TOOL_TEMPLATES[1].content}
                      title="模式 3 擬真展示"
                      className="w-full h-full min-h-0 border-0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1">
                    <div className="font-bold text-[var(--ink)]">零干擾純淨融入</div>
                    <div className="text-[var(--muted)]">自動識別 `&embed=true` 去除所有標題列與外圍邊框。</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1">
                    <div className="font-bold text-[var(--ink)]">高規格權限沙盒</div>
                    <div className="text-[var(--muted)]">預先配置安全 allow-scripts 與 allow-forms 屬性。</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1">
                    <div className="font-bold text-[var(--ink)]">平台通透相容</div>
                    <div className="text-[var(--muted)]">完美相容 Notion、Medium、WordPress 與自架部落格。</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. 五大排版檢視實境動態展示區 (5 Stationery Layouts)       */}
      {/* ======================================================== */}
      <section id="section-layouts" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="notebook-badge text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200">
              手帳美學與排版
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
              五大質感手帳排版模式
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              因應不同工作節奏隨心變換。不管是看板分欄、視覺牆面或專注單屏，皆能一鍵秒切。
            </p>
          </div>

          {/* 5 種排版切換按鈕組 */}
          <div className="flex justify-center overflow-x-auto pb-1 scrollbar-none">
            <div className="inline-flex p-1 rounded-2xl bg-[var(--card-bg)] border border-[var(--line)] text-xs font-semibold shadow-xs">
              {[
                { id: 'shelf', label: '分欄看板 (Shelf)', icon: <Kanban size={14} />, desc: '自訂分欄貨架，卡片自由拖曳歸類' },
                { id: 'wall', label: '緊湊瀑布流 (Wall)', icon: <Columns3 size={14} />, desc: '自適應高度瀑布流，排版錯落有致' },
                { id: 'grid', label: '標準網格 (Grid)', icon: <LayoutGrid size={14} />, desc: '支援 1x 與 2x 雙倍寬度自由調整' },
                { id: 'tabs', label: '分頁輪播 (Tabs)', icon: <Layers size={14} />, desc: '一次專注於單一工具，頂部輪播切換' },
                { id: 'collapsed', label: '折起專注 (Collapsed)', icon: <ListCollapse size={14} />, desc: '極簡手風琴手帳，收合節省空間' },
              ].map((lt) => (
                <button
                  key={lt.id}
                  type="button"
                  onClick={() => setActiveLayoutTab(lt.id)}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeLayoutTab === lt.id
                      ? 'bg-[var(--coral)] text-white font-bold shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {lt.icon}
                  <span>{lt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 排版擬真預覽卡片 */}
          <div className="notebook-card p-6 sm:p-8 bg-[var(--card-bg)] border border-[var(--line)] shadow-lg max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--coral)]" />
                <span className="font-bold text-sm text-[var(--ink)]">
                  {activeLayoutTab === 'shelf' && '分欄收納貨架 (看板 Kanban 模式)'}
                  {activeLayoutTab === 'wall' && '緊湊瀑布流 (視覺牆 Wall 模式)'}
                  {activeLayoutTab === 'grid' && '靈活網格 (標準 Grid 模式)'}
                  {activeLayoutTab === 'tabs' && '單頁專注 (分頁輪播 Tabs 模式)'}
                  {activeLayoutTab === 'collapsed' && '極簡手風琴 (折起專注 Collapsed 模式)'}
                </span>
              </div>
              <span className="text-xs text-[var(--muted)]">
                隨時在頂部導覽列一鍵切換
              </span>
            </div>

            {/* 互動示意內容 */}
            {activeLayoutTab === 'shelf' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-2">
                  <div className="text-xs font-bold text-[var(--ink)] pb-1 border-b border-[var(--line)] flex justify-between">
                    <span>專注學習欄</span>
                    <span className="text-[10px] text-[var(--muted)]">2 個工具</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--line)] text-xs font-semibold">番茄工作鐘</div>
                  <div className="p-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--line)] text-xs font-semibold">單字複習卡</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-2">
                  <div className="text-xs font-bold text-[var(--ink)] pb-1 border-b border-[var(--line)] flex justify-between">
                    <span>生活日常欄</span>
                    <span className="text-[10px] text-[var(--muted)]">2 個工具</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--line)] text-xs font-semibold">每日飲水計數</div>
                  <div className="p-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--line)] text-xs font-semibold">隨機轉盤選餐</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-2">
                  <div className="text-xs font-bold text-[var(--ink)] pb-1 border-b border-[var(--line)] flex justify-between">
                    <span>生產力工具</span>
                    <span className="text-[10px] text-[var(--muted)]">2 個工具</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--line)] text-xs font-semibold">Markdown 筆記</div>
                  <div className="p-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--line)] text-xs font-semibold">工程計算機</div>
                </div>
              </div>
            )}

            {activeLayoutTab === 'wall' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="h-32 p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] flex flex-col justify-between">
                  <span className="text-xs font-bold text-[var(--coral)]">隨手便利貼</span>
                  <span className="text-[10px] text-[var(--muted)]">精巧小尺寸便箋</span>
                </div>
                <div className="h-44 p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] flex flex-col justify-between">
                  <span className="text-xs font-bold text-indigo-500">番茄工作法計時鐘</span>
                  <span className="text-[10px] text-[var(--muted)]">含暫停與休息紀錄</span>
                </div>
                <div className="h-28 p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] flex flex-col justify-between">
                  <span className="text-xs font-bold text-emerald-500">密碼生成器</span>
                  <span className="text-[10px] text-[var(--muted)]">高強度安全隨機數</span>
                </div>
                <div className="h-40 p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] flex flex-col justify-between">
                  <span className="text-xs font-bold text-amber-500">標準計算機</span>
                  <span className="text-[10px] text-[var(--muted)]">全鍵位歷史紀錄</span>
                </div>
              </div>
            )}

            {activeLayoutTab === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-1">
                  <div className="text-xs font-bold text-[var(--ink)]">標準 1x 寬度卡片</div>
                  <div className="text-[11px] text-[var(--muted)]">一般小工具標準比例</div>
                </div>
                <div className="md:col-span-2 p-4 rounded-xl bg-[var(--coral-light)]/40 border border-[var(--coral-border)] space-y-1">
                  <div className="text-xs font-bold text-[var(--coral)]">雙倍 2x 加寬卡片</div>
                  <div className="text-[11px] text-[var(--muted)]">圖表、代碼編輯器或寬表格等需要大版面的工具</div>
                </div>
              </div>
            )}

            {activeLayoutTab === 'tabs' && (
              <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <span className="px-3 py-1 rounded-lg bg-[var(--coral)] text-white text-xs font-bold">1. 番茄計時鐘</span>
                  <span className="px-3 py-1 rounded-lg bg-[var(--card-bg)] text-[var(--muted)] text-xs border border-[var(--line)]">2. 靈感便箋</span>
                  <span className="px-3 py-1 rounded-lg bg-[var(--card-bg)] text-[var(--muted)] text-xs border border-[var(--line)]">3. 計算器</span>
                </div>
                <div className="p-6 rounded-lg bg-[var(--card-bg)] border border-[var(--line)] text-center text-xs text-[var(--muted)]">
                  滿版全神貫注於當前選定之小工具，兩側無干擾
                </div>
              </div>
            )}

            {activeLayoutTab === 'collapsed' && (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] flex items-center justify-between text-xs font-bold text-[var(--ink)]">
                  <span>#1 番茄工作法計時鐘 (已折起)</span>
                  <ChevronRight size={14} className="text-[var(--muted)]" />
                </div>
                <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] flex items-center justify-between text-xs font-bold text-[var(--ink)]">
                  <span>#2 隨手便利貼 (已折起)</span>
                  <ChevronRight size={14} className="text-[var(--muted)]" />
                </div>
                <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] flex items-center justify-between text-xs font-bold text-[var(--ink)]">
                  <span>#3 極簡計算機 (已折起)</span>
                  <ChevronRight size={14} className="text-[var(--muted)]" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. 四大核心特色柱 (Security, Layouts, Team, Presentation) */}
      {/* ======================================================== */}
      <section id="section-features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[var(--line)] bg-[var(--card-bg)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="notebook-badge text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200">
              工程級架構
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
              為什麼選擇工具小本本？
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              兼具文具質感與工程級安全的微應用手帳，專為高效率學習與生產力設計。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 特色 1：安全沙盒 */}
            <div className="notebook-card p-6 bg-[var(--paper)] space-y-3 border border-[var(--line)] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-[var(--ink)]">高防護沙盒隔離</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                所有自訂程式碼皆在獨立 Sandboxed iframe 執行，嚴格隔離主站 Token 與本機儲存，杜絕跨站指令碼風險。
              </p>
            </div>

            {/* 特色 2：5 款手帳排版 */}
            <div className="notebook-card p-6 bg-[var(--paper)] space-y-3 border border-[var(--line)] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[var(--coral-light)] text-[var(--coral)] flex items-center justify-center">
                <LayoutGrid size={20} />
              </div>
              <h3 className="text-base font-bold text-[var(--ink)]">5 款質感手帳排版</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                支援貨架分欄看板 (Shelf)、緊湊瀑布流 (Wall)、網格縮放 (Grid)、分頁輪播 (Tabs) 與折起專注 (Collapsed)。
              </p>
            </div>

            {/* 特色 3：團隊多人協作 */}
            <div className="notebook-card p-6 bg-[var(--paper)] space-y-3 border border-[var(--line)] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 flex items-center justify-center">
                <Users size={20} />
              </div>
              <h3 className="text-base font-bold text-[var(--ink)]">團隊協作與權限管理</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                擁有者、協作者與檢視者三階 RBAC 權限，憑邀請碼一鍵通關加入，內建團隊討論室與即時操作紀錄。
              </p>
            </div>

            {/* 特色 4：大螢幕簡報模式 */}
            <div className="notebook-card p-6 bg-[var(--paper)] space-y-3 border border-[var(--line)] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 flex items-center justify-center">
                <Tv size={20} />
              </div>
              <h3 className="text-base font-bold text-[var(--ink)]">大螢幕投影簡報模式</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                按下 Shift+P 隱藏所有選單與干擾元素，純淨大圖投影，適合教學展示、成果報告與講台即時互動。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. 精選範本專區展示與即時試玩 (Template Workshop)         */}
      {/* ======================================================== */}
      <section id="section-templates" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="notebook-badge text-[11px] font-bold text-[var(--coral)] bg-[var(--coral-light)] border-[var(--coral-border)]">
                開箱即用範本庫
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight mt-1">
                23 款質感離線小工具範本
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
                點擊任一範本卡片即可在獨立沙盒中即時試玩，亦可一鍵加入空間。
              </p>
            </div>

            {/* 分類篩選按鈕 */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {[
                { id: 'all', label: '全部範本' },
                { id: '效能與專注', label: '效能與專注' },
                { id: '靈感與創意', label: '靈感與創意' },
                { id: '實用工具', label: '實用工具' },
                { id: '生活日常', label: '生活日常' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setTemplateFilterCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    templateFilterCategory === c.id
                      ? 'bg-[var(--coral)] text-white shadow-xs'
                      : 'bg-[var(--card-bg)] text-[var(--muted)] hover:text-[var(--ink)] border border-[var(--line)]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTemplates.slice(0, 8).map((tmpl) => (
              <div
                key={tmpl.id}
                className="notebook-card p-4 bg-[var(--card-bg)] border border-[var(--line)] hover:border-[var(--coral)] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="notebook-badge text-[10px] bg-[var(--coral-light)] text-[var(--coral)] border-[var(--coral-border)]">
                      {tmpl.category}
                    </span>
                    <span className="text-[10px] text-[var(--muted)] font-mono">HTML/JS</span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--ink)] group-hover:text-[var(--coral)] transition-colors">
                    {tmpl.title}
                  </h4>
                  <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[var(--line)]/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewingTemplate(tmpl)}
                    className="notebook-btn-secondary text-xs py-1 px-2.5 flex items-center gap-1 text-[#3b827e] font-semibold"
                    title="在沙盒彈窗中即時操作"
                  >
                    <Play size={11} />
                    <span>即時試玩</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => (user ? onGoToDashboard() : onOpenLoginModal(true))}
                    className="notebook-btn-primary text-xs py-1 px-3 flex items-center gap-1 font-bold"
                  >
                    <span>免費使用</span>
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. 常見問題 (FAQ)                                        */}
      {/* ======================================================== */}
      <section id="section-faq" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[var(--line)] bg-[var(--card-bg)]">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
              常見問題與解答
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)]">
              關於自訂程式沙盒、代管微應用與團隊協作的常見疑問
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="notebook-card p-5 bg-[var(--paper)] border border-[var(--line)] space-y-2">
              <div className="font-bold text-[var(--ink)] text-sm">
                Q：什麼是「獨立代管微應用」？
              </div>
              <div className="text-[var(--muted)] leading-relaxed">
                答：它能將您在空間內製作或收集的小工具打包為專屬網址（例如 ?host=HOST-XXXXXX），訪客打開時直接全螢幕全版運行該應用，無需登入也不會看到後台管理按鈕，非常適合交付作品或分享給同儕使用。
              </div>
            </div>

            <div className="notebook-card p-5 bg-[var(--paper)] border border-[var(--line)] space-y-2">
              <div className="font-bold text-[var(--ink)] text-sm">
                Q：我可以把小工具嵌入到其他網站或部落格嗎？
              </div>
              <div className="text-[var(--muted)] leading-relaxed">
                答：完全可以！在發布中心點擊「複製 Iframe 嵌入代碼」，系統會自動產生標準 HTML iframe 標籤，並設定好沙盒權限，可直接貼在 Notion、WordPress、靜態網站或教學平台上。
              </div>
            </div>

            <div className="notebook-card p-5 bg-[var(--paper)] border border-[var(--line)] space-y-2">
              <div className="font-bold text-[var(--ink)] text-sm">
                Q：資料會儲存在哪裡？是否有離線備份？
              </div>
              <div className="text-[var(--muted)] leading-relaxed">
                答：登入狀態下會自動同步至雲端資料庫；同時系統支援「匯出工具 (.json)」與「備份空間 (.json)」，即便斷網也能本機保存，確保手帳資料永久安全。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. 手繪全景天際線 (Skyline Art) 與 Footer                */}
      {/* ======================================================== */}
      <div className="w-full flex justify-center items-end pointer-events-none overflow-hidden pt-8 bg-[var(--card-bg)]">
        <PanoramicSkyline className="w-full max-w-[1700px] h-24 sm:h-32 md:h-44 text-[var(--ink)] opacity-50 dark:opacity-35 pointer-events-none transition-opacity" />
      </div>

      <footer className="py-10 px-4 sm:px-6 lg:px-8 bg-[var(--card-bg)] border-t border-[var(--line)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[var(--muted)]">
          <div className="flex items-center gap-3">
            <div className="brand-mark">
              <BookOpen size={16} />
            </div>
            <div>
              <span className="font-bold text-[var(--ink)] block">
                工具小本本 Tool Notebook
              </span>
              <span className="text-[10px]">
                自訂微應用、程式嵌入與多人手帳空間
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5 font-medium">
            <button
              type="button"
              onClick={() => (user ? onGoToDashboard() : onOpenLoginModal(true))}
              className="text-[var(--coral)] hover:underline font-bold"
            >
              {user ? '進入工作空間' : '免費開始使用'}
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[var(--ink)] transition-colors"
            >
              回到頂部
            </button>
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* 8. 範本即時試玩預覽 Modal                                */}
      {/* ======================================================== */}
      {previewingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11151a]/60 backdrop-blur-sm animate-fadeIn">
          <div className="notebook-modal-box w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden shadow-2xl bg-[var(--card-bg)] border border-[var(--line)] rounded-2xl">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--line)] bg-[var(--paper)]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--coral)]" />
                <h3 className="text-sm font-bold text-[var(--ink)]">
                  範本即時試玩：{previewingTemplate.title}
                </h3>
                <span className="notebook-badge text-[10px]">
                  {previewingTemplate.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingTemplate(null)}
                className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] transition-colors"
                title="關閉試玩預覽"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 w-full relative overflow-hidden bg-white">
              <SandboxedFrame
                code={previewingTemplate.content}
                title={previewingTemplate.title}
                className="w-full h-full min-h-0 border-0"
              />
            </div>

            <div className="px-5 py-3 border-t border-[var(--line)] bg-[var(--paper)] flex items-center justify-between">
              <span className="text-xs text-[var(--muted)] truncate pr-2">
                {previewingTemplate.description}
              </span>
              <button
                type="button"
                onClick={() => {
                  setPreviewingTemplate(null);
                  user ? onGoToDashboard() : onOpenLoginModal(true);
                }}
                className="notebook-btn-primary text-xs py-1.5 px-4 font-bold shrink-0 flex items-center gap-1"
              >
                <span>收錄到我的手帳</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
