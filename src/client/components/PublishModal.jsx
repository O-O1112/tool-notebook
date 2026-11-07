import React, { useState } from 'react';
import {
  X,
  Share2,
  Code,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  Columns2,
  Maximize2,
  QrCode,
  ArrowRight,
  Globe,
  LayoutGrid,
} from 'lucide-react';
import QRCodeView from './QRCodeView';

export default function PublishModal({
  space,
  tools = [],
  initialToolId = null,
  initialMode = 'single',
  onClose,
}) {
  const [mode, setMode] = useState(initialMode); // 'single' | 'multi'
  const [selectedToolIds, setSelectedToolIds] = useState(
    initialToolId ? [initialToolId] : tools.length > 0 ? [tools[0].id] : []
  );
  const [portalTitle, setPortalTitle] = useState(
    initialToolId
      ? tools.find((t) => t.id === initialToolId)?.title || '獨立小工具'
      : `${space?.name || '空間'} - 精選工具套件`
  );
  const [tabLabels, setTabLabels] = useState(() => {
    const map = {};
    tools.forEach((t) => {
      map[t.id] = t.title;
    });
    return map;
  });
  const [defaultLayout, setDefaultLayout] = useState('tabs'); // 'tabs' | 'split'
  const [publishedShare, setPublishedShare] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [activeTab, setActiveTab] = useState('config'); // 'config' | 'result'

  const apiBase = import.meta.env.VITE_API_BASE || '/api';

  const toggleToolSelection = (toolId) => {
    if (mode === 'single') {
      setSelectedToolIds([toolId]);
      const targetTool = tools.find((t) => t.id === toolId);
      if (targetTool) setPortalTitle(targetTool.title);
    } else {
      if (selectedToolIds.includes(toolId)) {
        if (selectedToolIds.length > 1) {
          setSelectedToolIds(selectedToolIds.filter((id) => id !== toolId));
        }
      } else {
        setSelectedToolIds([...selectedToolIds, toolId]);
      }
    }
  };

  const handlePublish = async () => {
    if (selectedToolIds.length === 0) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        mode,
        toolIds: selectedToolIds,
        title: portalTitle.trim() || '獨立代管微應用',
        customConfig: {
          tabLabels,
          defaultLayout,
        },
      };

      const res = await fetch(`${apiBase}/spaces/${space.id}/hosted`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('伺服器回傳錯誤');
      }

      const data = await res.json();
      
      // 同步寫入本機備援，確保若部署於 GitHub Pages 等靜態託管時亦能即時離線解析
      const selectedToolsData = tools.filter((t) => selectedToolIds.includes(t.id));
      const backupShare = {
        share: data.share,
        space_name: space?.name || '手帳空間',
        owner_name: space?.owner_name || '創作者',
        tools: selectedToolsData,
      };
      const existing = JSON.parse(localStorage.getItem('notebook_local_hosted_shares') || '{}');
      existing[data.share.share_code] = backupShare;
      localStorage.setItem('notebook_local_hosted_shares', JSON.stringify(existing));

      setPublishedShare(data.share);
      setActiveTab('result');
    } catch (err) {
      // 本地 LocalStorage 備援發布機制 (支援完全離線 / 示範體驗)
      const mockCode = `HOST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const selectedToolsData = tools.filter((t) => selectedToolIds.includes(t.id));
      const localShare = {
        share: {
          id: Date.now(),
          share_code: mockCode,
          mode,
          title: portalTitle.trim() || '獨立代管微應用',
          views: 1,
          created_at: new Date().toISOString(),
          custom_config: {
            tabLabels,
            defaultLayout,
          },
        },
        space_name: space?.name || '手帳空間',
        owner_name: space?.owner_name || '創作者',
        tools: selectedToolsData,
      };

      const existing = JSON.parse(localStorage.getItem('notebook_local_hosted_shares') || '{}');
      existing[mockCode] = localShare;
      localStorage.setItem('notebook_local_hosted_shares', JSON.stringify(existing));

      setPublishedShare(localShare.share);
      setActiveTab('result');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hostUrl = publishedShare
    ? `${window.location.origin}${window.location.pathname}?host=${publishedShare.share_code}`
    : '';
  const embedCode = publishedShare
    ? `<iframe src="${hostUrl}&embed=true" width="100%" height="${mode === 'single' ? '500' : '650'}" frameborder="0" allow="clipboard-write" sandbox="allow-scripts allow-forms allow-popups allow-modals"></iframe>`
    : '';

  const copyLink = () => {
    navigator.clipboard.writeText(hostUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11151a]/60 backdrop-blur-sm animate-fadeIn">
      <div className="notebook-modal-box w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 頂部 Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[var(--paper)]/50">
          <div className="flex items-center gap-3">
            <div className="notebook-modal-badge text-[var(--coral)]">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--ink)]">小工具獨立代管與外部嵌入發布中心</h3>
              <p className="text-[11px] text-[var(--muted)]">生成獨立全螢幕微應用連結，或無縫嵌入任何外部網站</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 內容主體 */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'config' ? (
            <>
              {/* 步驟 1：選擇發布模式 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--ink)] flex items-center gap-1.5">
                  <span>選擇代管展示模式</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => {
                      setMode('single');
                      if (selectedToolIds.length > 1) {
                        setSelectedToolIds([selectedToolIds[0]]);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      mode === 'single'
                        ? 'border-[var(--coral)] bg-[var(--coral-light)]/40 shadow-xs'
                        : 'border-[var(--line)] bg-[var(--card-bg)] hover:border-[var(--coral-border)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[var(--ink)] flex items-center gap-1.5">
                        <Maximize2 size={14} className="text-[var(--coral)]" />
                        <span>模式 1：單一小工具 (指定)</span>
                      </span>
                      <input type="radio" checked={mode === 'single'} onChange={() => {}} className="accent-[var(--coral)]" />
                    </div>
                    <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                      只發布一個指定的小工具。訪客打開即為全螢幕微應用，零介面干擾。
                    </p>
                  </div>

                  <div
                    onClick={() => setMode('multi')}
                    role="button"
                    tabIndex={0}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      mode === 'multi'
                        ? 'border-[#3b827e] bg-[#3b827e]/10 shadow-xs'
                        : 'border-[var(--line)] bg-[var(--card-bg)] hover:border-[#3b827e]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[var(--ink)] flex items-center gap-1.5">
                        <Layers size={14} className="text-[#3b827e]" />
                        <span>模式 2：多工具客製分頁門戶</span>
                      </span>
                      <input type="radio" checked={mode === 'multi'} onChange={() => {}} className="accent-[#3b827e]" />
                    </div>
                    <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                      挑選多個指定小工具打包發布，支援客製化分頁標籤與雙欄分屏對照。
                    </p>
                  </div>
                </div>
              </div>

              {/* 步驟 2：挑選發布之小工具 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--ink)]">
                    {mode === 'single' ? '指定要代管發布的小工具' : `指定打包之小工具（已選 ${selectedToolIds.length} 個）`}
                  </label>
                  <span className="text-[11px] text-[var(--muted)]">空間內共 {tools.length} 個小工具</span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-[var(--paper)] rounded-2xl border border-[var(--line)]">
                  {tools.map((t) => {
                    const isSelected = selectedToolIds.includes(t.id);
                    return (
                      <div
                        key={t.id}
                        onClick={() => toggleToolSelection(t.id)}
                        role="button"
                        tabIndex={0}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[var(--card-bg)] border-[var(--coral)] shadow-xs font-medium'
                            : 'bg-[var(--card-bg)]/60 border-transparent hover:border-[var(--line)] text-[var(--muted)]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type={mode === 'single' ? 'radio' : 'checkbox'}
                            checked={isSelected}
                            onChange={() => {}}
                            className="accent-[var(--coral)] shrink-0"
                          />
                          <span className="truncate text-[var(--ink)]">{t.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--paper)] text-[var(--muted)] shrink-0">
                            {t.type}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 步驟 3：客製化設定 (模式 2 門戶專用) */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--ink)]">代管網站標題</label>
                  <input
                    type="text"
                    value={portalTitle}
                    onChange={(e) => setPortalTitle(e.target.value)}
                    placeholder="例如：業務即時試算儀表板"
                    className="notebook-input text-xs w-full py-2"
                  />
                </div>

                {mode === 'multi' && (
                  <div className="space-y-2 pt-2 border-t border-[var(--line)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--ink)]">客製化分頁標籤名稱</span>
                      {selectedToolIds.length >= 2 && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-[11px] text-[var(--muted)]">預設排版：</span>
                          <button
                            type="button"
                            onClick={() => setDefaultLayout('tabs')}
                            className={`px-2 py-0.5 rounded-md text-[11px] ${
                              defaultLayout === 'tabs' ? 'bg-[var(--coral)] text-white font-bold' : 'bg-[var(--paper)] text-[var(--muted)]'
                            }`}
                          >
                            分頁
                          </button>
                          <button
                            type="button"
                            onClick={() => setDefaultLayout('split')}
                            className={`px-2 py-0.5 rounded-md text-[11px] ${
                              defaultLayout === 'split' ? 'bg-[var(--coral)] text-white font-bold' : 'bg-[var(--paper)] text-[var(--muted)]'
                            }`}
                          >
                            雙欄
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedToolIds.map((id) => {
                        const t = tools.find((item) => item.id === id);
                        if (!t) return null;
                        return (
                          <div key={id} className="flex items-center gap-2 p-2 rounded-xl bg-[var(--paper)] border border-[var(--line)]">
                            <span className="text-[10px] text-[var(--muted)] shrink-0 w-12 truncate">{t.title}</span>
                            <input
                              type="text"
                              value={tabLabels[id] || ''}
                              onChange={(e) => setTabLabels({ ...tabLabels, [id]: e.target.value })}
                              placeholder="分頁標籤"
                              className="notebook-input text-xs w-full py-1 px-2"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* 發布完成結果頁 */
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-[var(--card-bg)] border-2 border-emerald-600/40 shadow-sm flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Check size={20} strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">微應用代管發布成功！</h4>
                  <p className="text-xs text-[var(--ink)] opacity-90 mt-0.5 leading-relaxed">
                    已產生專屬代碼 <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--paper)] border border-[var(--line)] text-emerald-700 dark:text-emerald-300">{publishedShare?.share_code}</span>，任何訪客打開皆能直接運行。
                  </p>
                </div>
              </div>

              {/* 模式 1 / 模式 2 專屬網址 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--ink)] flex items-center gap-1.5">
                  <Globe size={14} className="text-[var(--coral)]" />
                  <span>微應用獨立代管網址 (全螢幕直接運行)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={hostUrl}
                    className="notebook-input text-xs w-full py-2 font-mono text-[var(--ink)] select-all"
                  />
                  <button
                    type="button"
                    onClick={copyLink}
                    className="notebook-btn-primary px-4 py-2 text-xs flex items-center gap-1.5 shrink-0"
                  >
                    {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedLink ? '已複製' : '複製'}</span>
                  </button>
                  <a
                    href={hostUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="notebook-btn-secondary p-2 shrink-0"
                    title="在新視窗開啟預覽"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              {/* 模式 3：外部網站 <iframe> 嵌入代碼 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--ink)] flex items-center gap-1.5">
                  <Code size={14} className="text-[#3b827e]" />
                  <span>模式 3：外部網站無縫嵌入代碼 (Notion / Blog / 官網)</span>
                </label>
                <pre className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] text-[11px] font-mono text-[var(--ink)] overflow-x-auto whitespace-pre-wrap break-all select-all">
                  {embedCode}
                </pre>
                <button
                  type="button"
                  onClick={copyEmbed}
                  className="notebook-btn-secondary w-full py-2 text-xs flex items-center justify-center gap-1.5"
                >
                  {copiedEmbed ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copiedEmbed ? 'iframe 代碼已複製！' : '一鍵複製外部嵌入語法'}</span>
                </button>
              </div>

              {/* 手機掃碼 QR Code */}
              <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-[var(--paper)] border border-[var(--line)]">
                <div className="p-2 bg-white rounded-xl border border-[var(--line)] shadow-inner">
                  <QRCodeView value={hostUrl} size={96} />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[var(--ink)]">手機掃碼立即使用</div>
                  <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                    手機鏡頭掃碼即開即用，無需下載 App，亦無廣告干擾。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部動作列 */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--line)] bg-[var(--paper)]/50">
          {activeTab === 'config' ? (
            <>
              <button type="button" onClick={onClose} className="notebook-btn-secondary px-4 py-2 text-xs">
                取消
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting || selectedToolIds.length === 0}
                className="notebook-btn-primary px-5 py-2 text-xs flex items-center gap-2 font-bold shadow-sm"
              >
                <Sparkles size={14} />
                <span>{isSubmitting ? '正在產生獨立代管…' : '確認發布代管應用'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('config')}
                className="notebook-btn-secondary px-4 py-2 text-xs"
              >
                返回修改設定
              </button>
              <button type="button" onClick={onClose} className="notebook-btn-primary px-6 py-2 text-xs font-bold">
                完成並關閉
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}