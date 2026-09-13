import React, { useState } from 'react';
import { X, FolderPlus, Columns3, Kanban, LayoutGrid, Layers, ListCollapse, ArrowRight } from 'lucide-react';
import { DraftingNotebookDoodle } from './Illustrations';

const LAYOUT_OPTIONS = [
  { key: 'shelf', label: '貨架分欄', desc: '看板分欄分類', icon: Kanban },
  { key: 'wall', label: '緊湊瀑布流', desc: '無縫高矮自適應', icon: Columns3 },
  { key: 'grid', label: '網格並排', desc: '支援拖曳重排與自由縮放', icon: LayoutGrid },
  { key: 'tabs', label: '分頁輪播', desc: '橫向分頁切換小工具', icon: Layers },
  { key: 'collapsed', label: '折起專注', desc: '純清單點擊展開', icon: ListCollapse },
];

export default function CreateSpaceModal({ isOpen, onClose, onCreateSpace }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [layout, setLayout] = useState('shelf');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {
      await onCreateSpace({
        name: name.trim(),
        description: description.trim(),
        layout,
      });
      setName('');
      setDescription('');
      setLayout('shelf');
      onClose();
    } catch (err) {
      setError(err.message || '建立空間失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11151a]/60 backdrop-blur-sm animate-fadeIn">
      <div className="notebook-modal-box w-full max-w-md p-6 relative">
        {/* 背景方格藍圖草稿飾紋 */}
        <div className="absolute right-12 top-3 pointer-events-none opacity-25 dark:opacity-15">
          <DraftingNotebookDoodle className="w-16 h-13 text-[#60a5fa]" />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-lg transition-colors z-10"
        >
          <X size={16} />
        </button>

        <div className="notebook-modal-badge mb-3.5">
          <FolderPlus size={22} />
        </div>

        <h3 className="text-base font-bold text-[var(--ink)] mb-1">建立新工具空間</h3>
        <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
          建立專屬的小工具嵌入工作區，系統將自動產生邀請碼與 QR Code 供快速分享。
        </p>

        {error && (
          <div className="mb-3.5 p-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
              空間名稱 <span className="text-[var(--coral)]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：專案儀表板、課堂教學小工具、個人收納本"
              className="notebook-input w-full text-xs"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
              說明備註 (選填)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例如：收納常用計算機與互動教具"
              className="notebook-input w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--ink)] mb-1.5">
              預設佈局模式
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LAYOUT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = layout === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setLayout(opt.key)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2 ${
                      isSelected
                        ? 'border-[var(--coral)] bg-[var(--coral-light)] shadow-xs'
                        : 'border-[var(--line)] hover:border-[var(--coral-border)] bg-[var(--card-bg)]'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-[var(--coral-light)] text-[var(--coral)]' : 'bg-[var(--paper)] text-[var(--muted)]'}`}>
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className={`text-xs font-bold ${isSelected ? 'text-[var(--coral)]' : 'text-[var(--ink)]'}`}>
                        {opt.label}
                      </div>
                      <div className="text-[10px] text-[var(--muted)] truncate">
                        {opt.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 mt-2 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={onClose}
              className="notebook-btn-secondary text-xs py-2 px-4"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="notebook-btn-primary text-xs py-2 px-4"
            >
              <span>{loading ? '建立中…' : '確認建立'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
