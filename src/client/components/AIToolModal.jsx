import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Play,
  Check,
  RotateCcw,
  Code,
  Eye,
  Settings,
  Send,
  Download,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Folder,
  Layers,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import SandboxedFrame from './SandboxedFrame';
import {
  AI_PROVIDERS,
  PRESET_AI_PROMPTS,
  getAIConfig,
  saveAIConfig,
  generateToolCode,
} from '../utils/aiGenerator';
import { CraftStudioDoodle } from './Illustrations';

export default function AIToolModal({
  isOpen,
  onClose,
  onAddTool,
  currentSpaceName = '當前空間',
  initialSection = '一般工具',
}) {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [section, setSection] = useState(initialSection || '一般工具');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeViewTab, setActiveViewTab] = useState('preview'); // 'preview' | 'code'
  const [previewReloadKey, setPreviewReloadKey] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  // AI 供應商與金鑰設定狀態
  const [showConfig, setShowConfig] = useState(false);
  const [aiConfig, setAiConfig] = useState(() => getAIConfig());
  const [configSavedToast, setConfigSavedToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSection(initialSection || '一般工具');
      setAiConfig(getAIConfig());
      setErrorMsg('');
      if (!generatedCode) {
        // 如果還沒有代碼，檢查是否有 API Key，沒有的話自動展開設定提示
        const current = getAIConfig();
        if (!current.apiKey) {
          setShowConfig(true);
        }
      }
    }
  }, [isOpen, initialSection]);

  if (!isOpen) return null;

  const currentProvider = AI_PROVIDERS.find((p) => p.id === aiConfig.provider) || AI_PROVIDERS[0];

  const handleSaveConfig = (e) => {
    e?.preventDefault?.();
    saveAIConfig(aiConfig);
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 2500);
    setErrorMsg('');
  };

  const handleSelectPreset = (preset) => {
    setPrompt(preset.prompt);
    if (!title) {
      setTitle(preset.title);
    }
  };

  const handleGenerate = async (isRefining = false) => {
    if (!prompt.trim()) return;

    if (!aiConfig.apiKey?.trim()) {
      setShowConfig(true);
      setErrorMsg('請先填入 API Key 即可啟動 AI 代寫小工具。');
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');
    setProgressMsg('AI 正在為您架構小工具程式碼與交互邏輯...');

    try {
      const code = await generateToolCode({
        prompt: prompt.trim(),
        contextCode: isRefining ? generatedCode : '',
        config: aiConfig,
        onProgress: (msg) => setProgressMsg(msg),
      });

      setGeneratedCode(code);
      setActiveViewTab('preview');
      setPreviewReloadKey((k) => k + 1);

      if (!title.trim()) {
        const titleMatch = code.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) {
          setTitle(titleMatch[1].trim());
        } else {
          setTitle('AI 代寫實用小工具');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || '生成失敗，請確認 API Key 是否正確或重試。');
    } finally {
      setIsGenerating(false);
      setProgressMsg('');
    }
  };

  const handleConfirmAddToSpace = async () => {
    if (!generatedCode.trim()) return;

    try {
      await onAddTool({
        title: title.trim() || 'AI 智慧小工具',
        type: 'html',
        content: generatedCode,
        colSpan: 1,
        tags: ['AI代寫', '實用工具'],
        color: 'default',
        section: section || '一般工具',
      });
      handleClose();
    } catch (err) {
      alert(err.message || '加入空間失敗');
    }
  };

  const handleCopyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExportHtml = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'AI小工具'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setPrompt('');
    setGeneratedCode('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#11151a]/65 backdrop-blur-sm animate-fadeIn">
      <div className="notebook-modal-box w-full max-w-5xl flex flex-col h-[92vh] max-h-[880px] shadow-2xl border border-[var(--line)]">
        {/* Modal 頂部標題列 */}
        <div className="px-5 py-3.5 border-b border-[var(--line)] bg-[var(--paper)]/60 flex items-center justify-between select-none shrink-0 relative">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-[var(--ink)]">
                  AI 智慧代寫小工具工作室
                </h2>
                <span className="notebook-badge text-[10px] bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                  即時生成
                </span>
              </div>
              <p className="text-[11px] text-[var(--muted)] hidden sm:block">
                以繁體中文描述需求，AI 即時編寫具備實質檔案讀寫、本地儲存與專業運算之單檔小工具
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className={`notebook-btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1.5 ${
                showConfig ? 'bg-[var(--coral-light)] text-[var(--coral)] font-semibold' : ''
              }`}
              title="配置 AI 供應商與 API Key"
            >
              <Settings size={13} />
              <span className="hidden sm:inline">API 設定</span>
              {showConfig ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* API 設定抽屜 (Accordion) */}
        {showConfig && (
          <div className="px-5 py-3.5 bg-[var(--paper)] border-b border-[var(--line)] text-xs animate-fadeIn shrink-0">
            <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink)] mb-1 flex items-center justify-between">
                  <span>AI 供應商</span>
                  <a
                    href={currentProvider.keyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[var(--coral)] hover:underline flex items-center gap-0.5"
                  >
                    <span>取得免費 Key</span>
                    <ExternalLink size={10} />
                  </a>
                </label>
                <select
                  value={aiConfig.provider}
                  onChange={(e) => {
                    const newProviderId = e.target.value;
                    const prov = AI_PROVIDERS.find((p) => p.id === newProviderId) || AI_PROVIDERS[0];
                    setAiConfig({
                      ...aiConfig,
                      provider: newProviderId,
                      model: prov.defaultModel,
                      baseUrl: prov.baseUrl || '',
                    });
                  }}
                  className="notebook-input w-full text-xs py-1.5"
                >
                  {AI_PROVIDERS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink)] mb-1">
                  API Key (儲存於本機瀏覽器)
                </label>
                <div className="relative">
                  <KeyRound size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="password"
                    value={aiConfig.apiKey}
                    onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
                    placeholder={currentProvider.keyHelp}
                    className="notebook-input w-full text-xs py-1.5 pl-8"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-[var(--ink)] mb-1">
                    指定模型名稱
                  </label>
                  <input
                    type="text"
                    value={aiConfig.model}
                    onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}
                    placeholder={currentProvider.defaultModel}
                    className="notebook-input w-full text-xs py-1.5"
                  />
                </div>
                <button
                  type="submit"
                  className="notebook-btn-primary text-xs py-1.5 px-3 whitespace-nowrap h-[32px] mt-auto"
                >
                  <Check size={13} />
                  <span>儲存設定</span>
                </button>
              </div>
            </form>

            {configSavedToast && (
              <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium animate-fadeIn">
                API Key 設定已成功保存於本機瀏覽器！
              </div>
            )}
          </div>
        )}

        {/* 錯誤警示條 */}
        {errorMsg && (
          <div className="px-5 py-2.5 bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg('')}
              className="text-xs hover:underline shrink-0"
            >
              關閉
            </button>
          </div>
        )}

        {/* 主工作區 (左側需求輸入與微調 vs 右側即時預覽與代碼) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          {/* 左側面板 (5 欄)：需求描述與微調 */}
          <div className="lg:col-span-5 p-4 sm:p-5 border-r border-[var(--line)] flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="space-y-4">
              {/* 工具名稱與所屬分欄 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--ink)] mb-1">
                    小工具名稱
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例如：成績分佈直方圖"
                    className="notebook-input w-full text-xs py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--ink)] mb-1 flex items-center gap-1">
                    <Folder size={11} className="text-[var(--coral)]" />
                    <span>放置分欄 (Shelf)</span>
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="例如：一般工具"
                    className="notebook-input w-full text-xs py-1.5"
                  />
                </div>
              </div>

              {/* 需求自然語言輸入框 */}
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink)] mb-1.5 flex items-center justify-between">
                  <span>描述您的小工具需求</span>
                  <span className="text-[10px] text-[var(--muted)] font-normal">
                    {generatedCode ? '輸入補充指令進行微調' : '支援檔案讀寫/圖表/儲存'}
                  </span>
                </label>
                <textarea
                  rows={generatedCode ? 3 : 5}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：請寫一個成績輸入與統計工具，具備最高/最低/平均/及格率計算，以 Canvas 繪製直方圖，並能匯出 CSV 檔案..."
                  className="notebook-input w-full text-xs font-mono leading-relaxed resize-none"
                />
              </div>

              {/* 靈感範本快速點擊 */}
              <div>
                <span className="block text-[10px] font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wider">
                  點擊套用靈感需求範本
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRESET_AI_PROMPTS.map((preset) => (
                    <button
                      key={preset.title}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className="notebook-btn-secondary text-left p-2 rounded-xl text-xs hover:border-[var(--coral)] transition-colors group flex flex-col justify-between"
                    >
                      <span className="font-semibold text-[var(--ink)] group-hover:text-[var(--coral)] line-clamp-1">
                        {preset.title}
                      </span>
                      <span className="text-[10px] text-[var(--muted)] line-clamp-1 mt-0.5">
                        {preset.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 左側底部生成與微調按鈕 */}
            <div className="pt-3 border-t border-[var(--line)] space-y-2 shrink-0">
              {isGenerating ? (
                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl text-xs text-purple-700 dark:text-purple-300 flex items-center gap-2.5">
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="truncate">{progressMsg}</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  {generatedCode && (
                    <button
                      type="button"
                      onClick={() => handleGenerate(true)}
                      disabled={!prompt.trim()}
                      className="notebook-btn-secondary text-xs py-2 px-3 flex-1 justify-center gap-1.5 text-purple-600 hover:text-purple-700 border-purple-200"
                    >
                      <RotateCcw size={13} />
                      <span>根據要求微調代碼</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleGenerate(false)}
                    disabled={!prompt.trim()}
                    className="notebook-btn-primary text-xs py-2 px-4 flex-1 justify-center gap-1.5 shadow-sm"
                  >
                    <Sparkles size={14} />
                    <span>{generatedCode ? '全新重新生成' : '立即由 AI 編寫代碼'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 右側面板 (7 欄)：即時預覽與代碼展示 */}
          <div className="lg:col-span-7 flex flex-col h-full bg-[var(--paper)]/40 min-h-0">
            {/* 預覽 / 代碼檢視分頁切換列 */}
            <div className="px-4 py-2 bg-[var(--card-bg)] border-b border-[var(--line)] flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveViewTab('preview')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                    activeViewTab === 'preview'
                      ? 'bg-[var(--coral-light)] text-[var(--coral)]'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  <Eye size={13} />
                  <span>即時互動預覽</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewTab('code')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                    activeViewTab === 'code'
                      ? 'bg-[var(--coral-light)] text-[var(--coral)]'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  <Code size={13} />
                  <span>檢視 HTML5 原始碼</span>
                </button>
              </div>

              {generatedCode && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewReloadKey((k) => k + 1)}
                    className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] rounded-lg hover:bg-[var(--paper)] transition-colors"
                    title="重置小工具執行環境"
                  >
                    <RotateCcw size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="notebook-btn-secondary text-[11px] py-1 px-2 flex items-center gap-1"
                    title="複製整份 HTML 原始碼"
                  >
                    {copiedCode ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                    <span>{copiedCode ? '已複製' : '複製代碼'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportHtml}
                    className="notebook-btn-secondary text-[11px] py-1 px-2 flex items-center gap-1"
                    title="匯出為獨立 HTML 檔案"
                  >
                    <Download size={11} />
                    <span>匯出 .html</span>
                  </button>
                </div>
              )}
            </div>

            {/* 內容顯示區塊 */}
            <div className="flex-1 relative min-h-0 overflow-hidden">
              {generatedCode ? (
                activeViewTab === 'preview' ? (
                  <div className="w-full h-full relative bg-white">
                    <SandboxedFrame
                      htmlContent={generatedCode}
                      title={title || 'AI 生成小工具'}
                      reloadKey={previewReloadKey}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full p-4 overflow-auto bg-[#181d24] text-slate-100 font-mono text-xs leading-relaxed select-text">
                    <pre className="whitespace-pre-wrap">{generatedCode}</pre>
                  </div>
                )
              ) : (
                /* 尚未生成時的導引說明 */
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-3 text-[var(--muted)]">
                  <CraftStudioDoodle className="w-24 h-16 opacity-40 text-[var(--ink)] mb-1" />
                  <h3 className="text-sm font-bold text-[var(--ink)]">
                    等待 AI 編寫小工具
                  </h3>
                  <p className="text-xs max-w-sm leading-relaxed">
                    在左側描述您想要的工具需求，或點擊靈感範本，AI 將立即為您編寫具備實質數據計算、檔案讀寫與本機記憶功能的獨立工具。
                  </p>
                </div>
              )}
            </div>

            {/* 右側底部確認按鈕列 */}
            <div className="p-3 bg-[var(--card-bg)] border-t border-[var(--line)] flex items-center justify-between shrink-0">
              <span className="text-[11px] text-[var(--muted)]">
                {generatedCode ? '小工具已就緒，可隨時加入' : '支援 Google Gemini 與 Groq 開源小模型'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="notebook-btn-secondary text-xs py-1.5 px-3"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddToSpace}
                  disabled={!generatedCode.trim()}
                  className="notebook-btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5 shadow-sm"
                >
                  <Check size={14} />
                  <span>加入至【{section}】分欄</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
