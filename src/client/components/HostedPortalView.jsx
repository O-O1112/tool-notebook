import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Code,
  Layers,
  Columns2,
  Maximize2,
  Minimize2,
  Sparkles,
  ArrowUpRight,
  Eye,
  Info,
  ChevronDown,
  ChevronUp,
  Share2,
  BookOpen,
} from 'lucide-react';
import SandboxedFrame from './SandboxedFrame';
import QRCodeView from './QRCodeView';

export default function HostedPortalView({ hostedCode, onBackToHome }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hostedData, setHostedData] = useState(null);
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  const [viewMode, setViewMode] = useState('tabs'); // 'tabs' | 'split'
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 取得 API 基礎路徑
  const apiBase = import.meta.env.VITE_API_BASE || '/api';

  useEffect(() => {
    let isMounted = true;
    async function fetchHosted() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiBase}/hosted/${hostedCode}`);
        if (!res.ok) {
          // 若後端 404 或連線失敗，嘗試從本機 localStorage 尋找備援發布資料
          const localShares = JSON.parse(localStorage.getItem('notebook_local_hosted_shares') || '{}');
          if (localShares[hostedCode]) {
            if (isMounted) {
              setHostedData(localShares[hostedCode]);
              setLoading(false);
            }
            return;
          }
          throw new Error('找不到此獨立代管小工具，或連結已失效');
        }
        const data = await res.json();
        if (isMounted) {
          setHostedData(data);
          if (data.share?.custom_config?.defaultLayout) {
            setViewMode(data.share.custom_config.defaultLayout);
          }
        }
      } catch (err) {
        if (isMounted) {
          // 檢查 localStorage 備援
          const localShares = JSON.parse(localStorage.getItem('notebook_local_hosted_shares') || '{}');
          if (localShares[hostedCode]) {
            setHostedData(localShares[hostedCode]);
          } else {
            setError(err.message || '無法載入獨立代管應用');
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (hostedCode) {
      fetchHosted();
    }
    return () => {
      isMounted = false;
    };
  }, [hostedCode, apiBase]);

  // 動態設定瀏覽器頁籤標題
  useEffect(() => {
    if (hostedData?.share?.title) {
      document.title = `${hostedData.share.title} - 獨立小工具代管`;
    }
  }, [hostedData]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const currentEmbedUrl = currentUrl.includes('?') ? `${currentUrl}&embed=true` : `${currentUrl}?embed=true`;
  const embedIframeCode = `<iframe src="${currentEmbedUrl}" width="100%" height="600" frameborder="0" allow="clipboard-write" sandbox="allow-scripts allow-forms allow-popups allow-modals"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedIframeCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--paper,#fbfbf9)] text-[var(--ink,#1f2a2e)] p-6">
        <div className="w-12 h-12 rounded-2xl bg-[var(--coral-light,#fff0eb)] border border-[var(--coral-border,#f7d2c8)] flex items-center justify-center text-[var(--coral,#e17b62)] animate-pulse mb-4">
          <Sparkles size={24} />
        </div>
        <h2 className="text-base font-bold mb-1">正在載入獨立代管應用…</h2>
        <p className="text-xs text-[var(--muted,#89959b)]">獨立安全容器初始化中</p>
      </div>
    );
  }

  if (error || !hostedData || !hostedData.tools || hostedData.tools.length === 0) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--paper,#fbfbf9)] text-[var(--ink,#1f2a2e)] p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-500 flex items-center justify-center mb-4">
          <Info size={28} />
        </div>
        <h2 className="text-lg font-bold mb-2">無法開啟代管小工具</h2>
        <p className="text-sm text-[var(--muted,#89959b)] max-w-md mb-6">{error || '該工具可能已被作者下架或移除。'}</p>
        {onBackToHome && (
          <button type="button" onClick={onBackToHome} className="notebook-btn-primary px-5 py-2 text-xs flex items-center gap-2">
            <BookOpen size={14} />
            <span>返回工具小本本大廳</span>
          </button>
        )}
      </div>
    );
  }

  const { share, tools, space_name, owner_name, is_embed } = hostedData;
  const isSingleMode = share.mode === 'single' || tools.length === 1;
  const activeTool = tools[activeToolIndex] || tools[0];
  const customConfig = share.custom_config || {};
  const customTabs = customConfig.tabLabels || {};

  return (
    <div className={`relative w-screen h-screen flex flex-col bg-[var(--paper,#fbfbf9)] text-[var(--ink,#1f2a2e)] overflow-hidden select-none ${is_embed ? 'p-0' : ''}`}>
      {/* 模式 2：多工具客製化分頁與控制列 (當非模式 1 且工具 > 1 時呈現) */}
      {!isSingleMode && (
        <header className="shrink-0 h-12 bg-[var(--card-bg,#ffffff)]/90 backdrop-blur-md border-b border-[var(--line,#e4e8e5)] px-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--coral,#e17b62)] shrink-0" />
              <h1 className="text-sm font-bold text-[var(--ink,#1f2a2e)] truncate">{share.title}</h1>
            </div>

            {/* 客製化分頁按鈕清單 */}
            <nav className="hidden sm:flex items-center gap-1 ml-4 overflow-x-auto scrollbar-none">
              {tools.map((t, idx) => {
                const label = customTabs[t.id] || t.title;
                const active = activeToolIndex === idx && viewMode === 'tabs';
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setActiveToolIndex(idx);
                      setViewMode('tabs');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      active
                        ? 'bg-[var(--coral-light,#fff0eb)] text-[var(--coral,#e17b62)] font-bold shadow-xs'
                        : 'text-[var(--muted,#89959b)] hover:text-[var(--ink,#1f2a2e)] hover:bg-[var(--paper,#fbfbf9)]'
                    }`}
                  >
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* 雙欄對照與分頁模式切換 (當工具 >= 2 時支援) */}
            {tools.length >= 2 && (
              <div className="flex items-center bg-[var(--paper,#fbfbf9)] p-0.5 rounded-xl border border-[var(--line,#e4e8e5)] text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('tabs')}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                    viewMode === 'tabs' ? 'bg-[var(--card-bg,#ffffff)] font-bold text-[var(--coral,#e17b62)] shadow-xs' : 'text-[var(--muted,#89959b)]'
                  }`}
                  title="分頁切換檢視"
                >
                  <Layers size={13} />
                  <span className="hidden md:inline">分頁</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                    viewMode === 'split' ? 'bg-[var(--card-bg,#ffffff)] font-bold text-[var(--coral,#e17b62)] shadow-xs' : 'text-[var(--muted,#89959b)]'
                  }`}
                  title="左右雙欄對照檢視"
                >
                  <Columns2 size={13} />
                  <span className="hidden md:inline">雙欄</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-xl hover:bg-[var(--paper,#fbfbf9)] text-[var(--muted,#89959b)] hover:text-[var(--ink,#1f2a2e)] transition-colors"
              title={isFullscreen ? '退出全螢幕' : '全螢幕檢視'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </header>
      )}

      {/* 行動端小螢幕分頁切換條 */}
      {!isSingleMode && viewMode === 'tabs' && (
        <div className="sm:hidden shrink-0 flex items-center gap-1.5 overflow-x-auto px-3 py-1.5 bg-[var(--card-bg,#ffffff)] border-b border-[var(--line,#e4e8e5)] scrollbar-none text-xs">
          {tools.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveToolIndex(idx)}
              className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                activeToolIndex === idx
                  ? 'bg-[var(--coral-light,#fff0eb)] text-[var(--coral,#e17b62)] font-bold'
                  : 'bg-[var(--paper,#fbfbf9)] text-[var(--muted,#89959b)]'
              }`}
            >
              {customTabs[t.id] || t.title}
            </button>
          ))}
        </div>
      )}

      {/* 主體獨立渲染區 (100% 滿版獨立運行) */}
      <main className="flex-1 w-full h-full relative overflow-hidden bg-[var(--paper,#fbfbf9)]">
        {isSingleMode || viewMode === 'tabs' ? (
          // 模式 1 / 模式 2 (分頁): 單一工具全視窗填滿
          <div className="w-full h-full p-0">
            <SandboxedFrame
              code={activeTool.content}
              type={activeTool.type}
              title={activeTool.title}
              className="w-full h-full border-0 rounded-none shadow-none bg-transparent"
            />
          </div>
        ) : (
          // 模式 2 (雙欄對照 Split View): 左右並排同時互動操作
          <div className="w-full h-full flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-[var(--line,#e4e8e5)]">
            <div className="flex-1 h-1/2 md:h-full relative overflow-hidden flex flex-col">
              <div className="px-3 py-1 bg-[var(--card-bg,#ffffff)]/80 border-b border-[var(--line,#e4e8e5)] text-[11px] font-bold text-[var(--muted,#89959b)] flex items-center justify-between">
                <span>{customTabs[tools[0].id] || tools[0].title}</span>
                <span className="text-[10px] text-[var(--coral,#e17b62)] font-normal">左欄工具</span>
              </div>
              <div className="flex-1 w-full h-full">
                <SandboxedFrame code={tools[0].content} type={tools[0].type} title={tools[0].title} className="w-full h-full border-0" />
              </div>
            </div>
            <div className="flex-1 h-1/2 md:h-full relative overflow-hidden flex flex-col">
              <div className="px-3 py-1 bg-[var(--card-bg,#ffffff)]/80 border-b border-[var(--line,#e4e8e5)] text-[11px] font-bold text-[var(--muted,#89959b)] flex items-center justify-between">
                <span>{customTabs[tools[1].id] || tools[1].title}</span>
                <span className="text-[10px] text-[#3b827e] font-normal">右欄工具</span>
              </div>
              <div className="flex-1 w-full h-full">
                <SandboxedFrame code={tools[1].content} type={tools[1].type} title={tools[1].title} className="w-full h-full border-0" />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================================================================= */}
      {/* 浮動微型作者標章與分享控制膠囊 (Unobtrusive Floating Dock)        */}
      {/* 若是外部 iframe 嵌入 (is_embed=true)，自動隱藏以保持 100% 原生無縫融和 */}
      {/* ================================================================= */}
      {!is_embed && (
        <aside className="fixed bottom-3 right-3 z-30 transition-all select-none">
          {dockCollapsed ? (
            <button
              type="button"
              onClick={() => setDockCollapsed(false)}
              className="p-2 rounded-full bg-[var(--card-bg,#ffffff)]/90 backdrop-blur-md border border-[var(--line,#e4e8e5)] shadow-lg text-[var(--muted,#89959b)] hover:text-[var(--coral,#e17b62)] hover:scale-105 transition-all"
              title="展開代管發布資訊"
            >
              <Sparkles size={16} />
            </button>
          ) : (
            <div className="bg-[var(--card-bg,#ffffff)]/95 backdrop-blur-md border border-[var(--line,#e4e8e5)] rounded-2xl p-2.5 shadow-xl flex items-center gap-3 text-xs animate-fadeIn">
              <div className="flex items-center gap-2 pl-1 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-[var(--coral-light,#fff0eb)] border border-[var(--coral-border,#f7d2c8)] flex items-center justify-center text-[var(--coral,#e17b62)] font-bold text-xs shrink-0">
                  {owner_name ? owner_name.slice(0, 1) : '創'}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[var(--ink,#1f2a2e)] truncate text-[11px]">
                    {isSingleMode ? activeTool.title : share.title}
                  </div>
                  <div className="text-[10px] text-[var(--muted,#89959b)] truncate">
                    由 {owner_name || '創作者'} 代管發布
                  </div>
                </div>
              </div>

              <div className="h-4 w-[1px] bg-[var(--line,#e4e8e5)]" />

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-xl hover:bg-[var(--paper,#fbfbf9)] text-[var(--muted,#89959b)] hover:text-[var(--coral,#e17b62)] transition-colors relative"
                  title="複製代管網址"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                </button>

                <button
                  type="button"
                  onClick={() => setShowEmbedCode(!showEmbedCode)}
                  className={`p-1.5 rounded-xl hover:bg-[var(--paper,#fbfbf9)] transition-colors ${
                    showEmbedCode ? 'text-[var(--coral,#e17b62)] bg-[var(--coral-light,#fff0eb)]' : 'text-[var(--muted,#89959b)] hover:text-[var(--ink,#1f2a2e)]'
                  }`}
                  title="複製外部網站嵌入語法 (模式 3)"
                >
                  <Code size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => setShowQr(!showQr)}
                  className={`p-1.5 rounded-xl hover:bg-[var(--paper,#fbfbf9)] transition-colors ${
                    showQr ? 'text-[var(--coral,#e17b62)] bg-[var(--coral-light,#fff0eb)]' : 'text-[var(--muted,#89959b)] hover:text-[var(--ink,#1f2a2e)]'
                  }`}
                  title="手機掃描 QR Code"
                >
                  <ArrowUpRight size={14} />
                </button>

                {onBackToHome && (
                  <button
                    type="button"
                    onClick={onBackToHome}
                    className="p-1.5 rounded-xl hover:bg-[var(--paper,#fbfbf9)] text-[var(--muted,#89959b)] hover:text-[var(--coral,#e17b62)] transition-colors"
                    title="開啟工具小本本主站"
                  >
                    <BookOpen size={14} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setDockCollapsed(true)}
                  className="p-1 rounded-lg text-[var(--muted,#89959b)] hover:text-[var(--ink,#1f2a2e)]"
                  title="收合標章"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          )}
        </aside>
      )}

      {/* 模式 3：外部網站嵌入語法彈出卡片 */}
      {showEmbedCode && !is_embed && (
        <div className="fixed bottom-16 right-3 z-40 w-80 bg-[var(--card-bg,#ffffff)] border border-[var(--line,#e4e8e5)] rounded-2xl p-4 shadow-2xl text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="font-bold text-[var(--ink,#1f2a2e)] flex items-center gap-1.5">
              <Code size={14} className="text-[var(--coral,#e17b62)]" />
              <span>模式 3：外部網站無縫嵌入代碼</span>
            </div>
            <button type="button" onClick={() => setShowEmbedCode(false)} className="text-[var(--muted,#89959b)] hover:text-[var(--ink,#1f2a2e)]">
              ✕
            </button>
          </div>
          <p className="text-[11px] text-[var(--muted,#89959b)] leading-relaxed">
            貼入任何 Notion、WordPress、個人作品集或企業系統，自動去除外框原生融入：
          </p>
          <pre className="p-2.5 rounded-xl bg-[var(--paper,#fbfbf9)] border border-[var(--line,#e4e8e5)] text-[10px] font-mono text-[var(--ink,#1f2a2e)] overflow-x-auto whitespace-pre-wrap break-all select-all">
            {embedIframeCode}
          </pre>
          <button
            type="button"
            onClick={handleCopyEmbed}
            className="w-full notebook-btn-primary py-2 text-xs flex items-center justify-center gap-1.5 font-bold"
          >
            {copiedEmbed ? <Check size={13} /> : <Copy size={13} />}
            <span>{copiedEmbed ? '代碼已複製到剪貼簿！' : '一鍵複製 iframe 語法'}</span>
          </button>
        </div>
      )}

      {/* 手機向量 QR Code 預覽快顯 */}
      {showQr && !is_embed && (
        <div className="fixed bottom-16 right-3 z-40 w-64 bg-[var(--card-bg,#ffffff)] border border-[var(--line,#e4e8e5)] rounded-2xl p-4 shadow-2xl text-xs space-y-3 text-center animate-fadeIn">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--line,#e4e8e5)]">
            <span className="font-bold text-[var(--ink,#1f2a2e)]">手機掃碼立即使用</span>
            <button type="button" onClick={() => setShowQr(false)} className="text-[var(--muted,#89959b)] hover:text-[var(--ink,#1f2a2e)]">
              ✕
            </button>
          </div>
          <div className="p-3 bg-white rounded-xl inline-block border border-[var(--line,#e4e8e5)] shadow-inner">
            <QRCodeView value={currentUrl} size={150} />
          </div>
          <p className="text-[10px] text-[var(--muted,#89959b)]">免登入、無安裝，直接全螢幕獨立運行</p>
        </div>
      )}
    </div>
  );
}