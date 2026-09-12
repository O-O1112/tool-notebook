import React, { useState, useEffect, useRef } from 'react';
import { X, Settings, Download, Upload, Trash2, Check, AlertTriangle, FileText } from 'lucide-react';

export default function SpaceSettingsModal({
  isOpen,
  space,
  tools = [],
  onClose,
  onUpdateSpace,
  onDeleteSpace,
  onImportTools,
  isOwner = true,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (space) {
      setName(space.name || '');
      setDescription(space.description || '');
      setDeleteConfirm(false);
    }
  }, [space, isOpen]);

  if (!isOpen || !space) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await onUpdateSpace(space.id, {
        name: name.trim(),
        description: description.trim(),
      });
      onClose();
    } catch (err) {
      alert(err.message || '更新空間設定失敗');
    } finally {
      setSubmitting(false);
    }
  };

  // 匯出目前空間所有工具為 JSON
  const handleExportJSON = () => {
    const exportData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      spaceName: space.name,
      description: space.description,
      tools: tools.map((t) => ({
        title: t.title,
        type: t.type,
        content: t.content,
        col_span: t.col_span || 1,
        tags: t.tags || [],
        isPinned: Boolean(t.isPinned),
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `空間工具備份_${space.name}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 匯入 JSON 工具檔
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data.tools) || data.tools.length === 0) {
        alert('此備份檔中沒有找到有效的小工具清單！');
        return;
      }

      const confirmImport = window.confirm(`確認將「${file.name}」中的 ${data.tools.length} 個小工具匯入至此空間？`);
      if (confirmImport) {
        await onImportTools(space.id, data.tools);
        onClose();
      }
    } catch (err) {
      alert('無法解析匯入檔案，請確認格式為合法的 JSON 檔案！');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2a2e]/50 backdrop-blur-sm animate-fadeIn">
      <div className="notebook-card w-full max-w-lg bg-white overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal 標題列 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e8e5]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e17b62]" />
            <h2 className="text-base font-bold text-[#1f2a2e] flex items-center gap-2">
              <Settings size={17} className="text-[#e17b62]" />
              <span>空間設定與備份</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#89959b] hover:text-[#1f2a2e] hover:bg-[#f5f7f6] rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 內容區塊 */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 1. 空間基本資訊表單 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1f2a2e] mb-1.5">
                空間名稱
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：團隊日常工作看板"
                className="notebook-input w-full"
                disabled={!isOwner}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1f2a2e] mb-1.5">
                空間備註說明
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="為這個空間加入簡述或備忘…"
                className="notebook-input w-full resize-none text-xs"
                disabled={!isOwner}
              />
            </div>

            {isOwner && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !name.trim()}
                  className="notebook-btn-primary text-xs py-2"
                >
                  <Check size={14} />
                  <span>{submitting ? '儲存中…' : '儲存空間名稱'}</span>
                </button>
              </div>
            )}
          </form>

          {/* 2. 備份匯出與匯入 */}
          <div className="pt-4 border-t border-[#e4e8e5]">
            <h4 className="text-xs font-semibold text-[#1f2a2e] mb-2.5 flex items-center gap-1.5">
              <FileText size={14} className="text-[#e17b62]" />
              <span>工具備份與轉移 (JSON)</span>
            </h4>
            <p className="text-[11px] text-[#89959b] mb-3 leading-relaxed">
              可將目前空間內的 {tools.length} 個小工具設定下載為 JSON 檔案，或匯入他人分享的工具套裝。
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleExportJSON}
                disabled={tools.length === 0}
                className="notebook-btn-secondary text-xs py-2 justify-center flex items-center gap-1.5"
                title="下載當前空間小工具設定檔"
              >
                <Download size={14} />
                <span>匯出工具備份</span>
              </button>

              {isOwner && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json,application/json"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="notebook-btn-secondary text-xs py-2 justify-center flex items-center gap-1.5"
                    title="從 JSON 檔匯入小工具清單"
                  >
                    <Upload size={14} />
                    <span>匯入工具清單</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 3. 危險操作區 (刪除空間) */}
          {isOwner && (
            <div className="pt-4 border-t border-[#e4e8e5]">
              <div className="p-3 bg-red-50/70 border border-red-200 rounded-notebook-sm flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-red-700 block">刪除此空間</span>
                  <span className="text-[11px] text-red-600/80 block">此空間與其包含的工具將被永久移除</span>
                </div>
                {!deleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(true)}
                    className="notebook-btn-secondary text-xs py-1.5 px-3 text-red-700 border-red-300 hover:bg-red-100/50"
                  >
                    刪除
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(false)}
                      className="notebook-btn-secondary text-xs py-1.5 px-2 text-[#89959b]"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSpace(space.id)}
                      className="notebook-btn-primary text-xs py-1.5 px-3 bg-red-600 hover:bg-red-700 border-red-600"
                    >
                      確認刪除
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
