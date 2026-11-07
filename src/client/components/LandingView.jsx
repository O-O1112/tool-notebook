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
} from 'lucide-react';
import SandboxedFrame from './SandboxedFrame';
import { TOOL_TEMPLATES } from '../utils/toolTemplates';
import { WashiTapePinDoodle, LoginWelcomeIllustration } from './Illustrations';

export default function LandingView({
  user,
  onGoToDashboard,
  onOpenLoginModal,
  theme = 'warm',
  onToggleDarkMode,
}) {
  const [activeModeTab, setActiveModeTab] = useState('single'); // 'single' | 'tabs' | 'split'
  const demoTool = TOOL_TEMPLATES[0]; // 番茄工作法計時鐘

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] select-none">
      {/* ======================================================== */}
      {/* 頂部導覽列 (Landing Header)                              */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-[var(--card-bg)]/90 backdrop-blur-md border-b border-[var(--line)] px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* 左側：品牌標識與簡述 */}
          <div className="flex items-center gap-3">
            <div className="brand-mark">
              <BookOpen size={18} />
            </div>
            <div>
              <span className="font-bold text-base text-[var(--ink)] block leading-tight">
                工具小本本
              </span>
              <span className="text-[10px] text-[var(--muted)] hidden sm:block">
                自訂微應用與嵌入空間
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
              精選範本
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
      {/* 1. Hero 視覺震撼區 (標語、行動按鈕與即時沙盒試玩)        */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* 左側文案與行動呼籲 */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--coral-light)] border border-[var(--coral-border)] text-[var(--coral)] text-xs font-bold tracking-wide">
              <Sparkles size={13} />
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
                瀏覽範本專區
              </button>
            </div>

            {/* 統計與特色小標記 */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-[var(--muted)] font-medium">
              <div className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-500 stroke-[3]" />
                <span>20+ 款內建精選範本</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-500 stroke-[3]" />
                <span>3 大獨立代管模式</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-500 stroke-[3]" />
                <span>100% 沙盒隔離</span>
              </div>
            </div>
          </div>

          {/* 右側：可即刻操作的微應用即時體驗沙盒卡片 */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <div className="notebook-card p-4 sm:p-5 shadow-2xl relative border-2 border-[var(--coral-border)] bg-[var(--card-bg)]">
              {/* 置頂和紙膠帶飾紋 */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                <WashiTapePinDoodle className="w-24 h-6 text-[var(--coral)]" />
              </div>

              {/* 卡片標題控制列 */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--line)]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--coral)]" />
                  <span className="font-bold text-sm text-[var(--ink)]">
                    互動預覽：{demoTool.title}
                  </span>
                  <span className="notebook-badge text-[10px]">自訂程式</span>
                </div>
                <span className="text-[10px] text-[var(--muted)] font-mono">
                  沙盒中即時執行
                </span>
              </div>

              {/* 沙盒運行容器 (訪客可直接操作番茄鐘計時) */}
              <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--paper)]">
                <SandboxedFrame
                  code={demoTool.content}
                  title={demoTool.title}
                  className="w-full h-full min-h-0"
                />
              </div>

              <div className="mt-3 pt-2 flex items-center justify-between text-xs text-[var(--muted)]">
                <span className="text-[11px]">
                  無需安裝任何本機環境，輸入或匯入代碼即可安全運行
                </span>
                <button
                  type="button"
                  onClick={() => (user ? onGoToDashboard() : onOpenLoginModal(true))}
                  className="text-[var(--coral)] font-semibold hover:underline flex items-center gap-1"
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
      {/* 2. 三大微應用代管發布模式 (Hosted Micro-Apps)             */}
      {/* ======================================================== */}
      <section id="section-modes" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[var(--line)] bg-[var(--card-bg)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="notebook-badge text-[11px] font-bold text-[var(--coral)] bg-[var(--coral-light)] border-[var(--coral-border)]">
              核心亮點功能
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
              三大微應用獨立代管模式
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              將空間內的小工具打包成專屬獨立網址，使用者無需進入管理後台，即可享受 100% 滿版獨立運行或無縫嵌入任何網站。
            </p>
          </div>

          {/* 模式切換 Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 rounded-2xl bg-[var(--paper)] border border-[var(--line)] text-xs font-semibold">
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
                <span>模式 1：單一小工具 (指定)</span>
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
                <span>模式 2：指定多工具 + 客製分頁</span>
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
                <Columns2 size={14} />
                <span>模式 3：雙欄對照 / 外部嵌入</span>
              </button>
            </div>
          </div>

          {/* 模式展示內容 */}
          <div className="notebook-card p-6 sm:p-8 bg-[var(--paper)] border border-[var(--line)] shadow-lg max-w-4xl mx-auto">
            {activeModeTab === 'single' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
                  <div>
                    <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--coral)]" />
                      模式 1：單一小工具全螢幕獨立運行
                    </h3>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      純淨無干擾，專注於單一工具功能，不顯示任何空間後台介面。
                    </p>
                  </div>
                  <span className="notebook-badge bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-200 text-xs">
                    專屬 HOST 網址直達
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1.5">
                    <div className="font-bold text-[var(--ink)]">適用場景</div>
                    <div className="text-[var(--muted)]">交付給學生、顧客或同儕的獨立工具（如計時器、計算器、表單）。</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1.5">
                    <div className="font-bold text-[var(--ink)]">獨立運行網址</div>
                    <div className="font-mono text-[var(--coral)] text-[11px] truncate">
                      ?host=HOST-XXXXXX
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1.5">
                    <div className="font-bold text-[var(--ink)]">外部 Iframe 支援</div>
                    <div className="text-[var(--muted)]">自動隱藏標章與控制欄，100% 融入自架網站。</div>
                  </div>
                </div>
              </div>
            )}

            {activeModeTab === 'tabs' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
                  <div>
                    <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      模式 2：指定多工具加上高度客製化分頁
                    </h3>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      打包 2 至多個工具，為每個分頁自訂易懂標籤，訪客自由切換無拘束。
                    </p>
                  </div>
                  <span className="notebook-badge bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 border-indigo-200 text-xs">
                    多功能工具箱
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1.5">
                    <div className="font-bold text-[var(--ink)]">客製分頁標籤</div>
                    <div className="text-[var(--muted)]">自由重新命名分頁按鈕，如「工作碼錶」、「備忘筆記」、「匯率計算」。</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1.5">
                    <div className="font-bold text-[var(--ink)]">狀態不中斷</div>
                    <div className="text-[var(--muted)]">分頁切換時背景狀態完整保留，工作流暢不卡頓。</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1.5">
                    <div className="font-bold text-[var(--ink)]">作者微型標章</div>
                    <div className="text-[var(--muted)]">右下角浮動膠囊優雅呈現空間與創作者資訊，可一鍵收合。</div>
                  </div>
                </div>
              </div>
            )}

            {activeModeTab === 'split' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
                  <div>
                    <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-500" />
                      模式 3：雙欄對照運行 / 外部網站 Iframe 嵌入
                    </h3>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      左右分割雙欄同步操作，或透過標準 iframe 程式碼嵌入外部自架站。
                    </p>
                  </div>
                  <span className="notebook-badge bg-teal-50 dark:bg-teal-950/30 text-teal-600 border-teal-200 text-xs">
                    高效並排作業
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1.5">
                    <div className="font-bold text-[var(--ink)]">左右雙欄並排</div>
                    <div className="text-[var(--muted)]">一邊查閱文檔或資料，一邊進行即時轉換或編碼作業。</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1.5">
                    <div className="font-bold text-[var(--ink)]">一鍵嵌入代碼</div>
                    <div className="text-[var(--muted)]">內建標準 iframe 標籤，提供安全沙盒權限配置。</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] space-y-1.5">
                    <div className="font-bold text-[var(--ink)]">全螢幕切換</div>
                    <div className="text-[var(--muted)]">支援一鍵切換視窗全螢幕，享受沉浸工作體驗。</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. 四大核心特色柱 (Security, Layouts, Team, Presentation) */}
      {/* ======================================================== */}
      <section id="section-features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="notebook-badge text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200">
              功能特色巡覽
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
            <div className="notebook-card p-6 bg-[var(--card-bg)] space-y-3 border border-[var(--line)] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-[var(--ink)]">高防護沙盒隔離</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                所有自訂程式碼皆在獨立 Sandboxed iframe 執行，嚴格隔離主站 Token 與本機儲存，杜絕跨站指令碼風險。
              </p>
            </div>

            {/* 特色 2：5 款手帳排版 */}
            <div className="notebook-card p-6 bg-[var(--card-bg)] space-y-3 border border-[var(--line)] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[var(--coral-light)] text-[var(--coral)] flex items-center justify-center">
                <LayoutGrid size={20} />
              </div>
              <h3 className="text-base font-bold text-[var(--ink)]">5 款質感手帳排版</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                支援貨架分欄看板 (Shelf)、緊湊瀑布流 (Wall)、網格縮放 (Grid)、分頁輪播 (Tabs) 與折起專注 (Collapsed)。
              </p>
            </div>

            {/* 特色 3：團隊多人協作 */}
            <div className="notebook-card p-6 bg-[var(--card-bg)] space-y-3 border border-[var(--line)] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 flex items-center justify-center">
                <Users size={20} />
              </div>
              <h3 className="text-base font-bold text-[var(--ink)]">團隊協作與權限管理</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                擁有者、協作者與檢視者三階 RBAC 權限，憑邀請碼一鍵通關加入，內建團隊討論室與即時操作紀錄。
              </p>
            </div>

            {/* 特色 4：大螢幕簡報模式 */}
            <div className="notebook-card p-6 bg-[var(--card-bg)] space-y-3 border border-[var(--line)] shadow-sm hover:shadow-md transition-shadow">
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
      {/* 4. 精選範本專區展示 (Template Showcase)                   */}
      {/* ======================================================== */}
      <section id="section-templates" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[var(--line)] bg-[var(--card-bg)]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="notebook-badge text-[11px] font-bold text-[var(--coral)] bg-[var(--coral-light)] border-[var(--coral-border)]">
                開箱即用範本庫
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight mt-1">
                20+ 款質感離線小工具範本
              </h2>
            </div>
            <button
              type="button"
              onClick={onGoToDashboard}
              className="notebook-btn-primary text-xs py-2 px-4 flex items-center gap-1.5 font-bold"
            >
              <span>瀏覽完整範本專區</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOL_TEMPLATES.slice(0, 6).map((tmpl) => (
              <div
                key={tmpl.id}
                className="notebook-card p-5 bg-[var(--paper)] border border-[var(--line)] space-y-3 hover:border-[var(--coral-border)] transition-colors group cursor-pointer"
                onClick={onGoToDashboard}
              >
                <div className="flex items-center justify-between">
                  <span className="notebook-badge text-[10px] bg-[var(--card-bg)]">
                    {tmpl.category}
                  </span>
                  <Code size={13} className="text-amber-500 opacity-70 group-hover:opacity-100" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--ink)] group-hover:text-[var(--coral)] transition-colors">
                    {tmpl.title}
                  </h4>
                  <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-[11px] text-[var(--coral)] font-semibold border-t border-[var(--line)]/60">
                  <span>一鍵加入空間</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. 常見問題 (FAQ)                                        */}
      {/* ======================================================== */}
      <section id="section-faq" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[var(--line)]">
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
            <div className="notebook-card p-5 bg-[var(--card-bg)] border border-[var(--line)] space-y-2">
              <div className="font-bold text-[var(--ink)]">
                Q：什麼是「獨立代管微應用」？
              </div>
              <div className="text-[var(--muted)] leading-relaxed">
                答：它能將您在空間內製作或收集的小工具打包為專屬網址（例如 ?host=HOST-XXXXXX），訪客打開時直接全螢幕全版運行該應用，無需登入也不會看到後台管理按鈕，非常適合交付作品或分享給同儕使用。
              </div>
            </div>

            <div className="notebook-card p-5 bg-[var(--card-bg)] border border-[var(--line)] space-y-2">
              <div className="font-bold text-[var(--ink)]">
                Q：我可以把小工具嵌入到其他網站或部落格嗎？
              </div>
              <div className="text-[var(--muted)] leading-relaxed">
                答：完全可以！在發布中心點擊「複製 Iframe 嵌入代碼」，系統會自動產生標準 HTML iframe 標籤，並設定好沙盒權限，可直接貼在 Notion、WordPress、靜態網站或教學平台上。
              </div>
            </div>

            <div className="notebook-card p-5 bg-[var(--card-bg)] border border-[var(--line)] space-y-2">
              <div className="font-bold text-[var(--ink)]">
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
      {/* 6. 底部呼籲與 Footer                                     */}
      {/* ======================================================== */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-[var(--card-bg)]">
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
                多功能自訂微應用與程式嵌入手帳空間
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 font-medium">
            <button
              type="button"
              onClick={() => (user ? onGoToDashboard() : onOpenLoginModal(true))}
              className="text-[var(--coral)] hover:underline font-bold"
            >
              {user ? '進入工作空間' : '免費註冊使用'}
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
    </div>
  );
}
