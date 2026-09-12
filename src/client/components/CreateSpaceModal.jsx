import React, { useState } from 'react';
import { X, FolderPlus, Columns3, Kanban, LayoutGrid, Layers, ListCollapse, ArrowRight } from 'lucide-react';

const LAYOUT_OPTIONS = [
  { key: 'shelf', label: '貨架分欄', desc: 'Padlet Shelf / 看板分類', icon: Columns3 },
  { key: 'wall', label: '緊湊瀑布流', desc: 'Padlet Wall / 無縫高矮自適應', icon: Kanban },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2a2e]/50 backdrop-blur-sm animate-fadeIn">
      <div className="notebook-card w-full max-w-md p-6 bg-white shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-[#89959b] hover:text-[#1f2a2e] hover:bg-[#f5f7f6] rounded-md transition-colors"
        >
          <X size={16} />
        </button>

        <div className="w-12 h-12 rounded-xl bg-[#fff0eb] text-[#e17b62] flex items-center justify-center mb-3.5 border border-[#e1ac9e]">
          <FolderPlus size={22} />
        </div>

        <h3 className="text-base font-bold text-[#1f2a2e] mb-1">建立新工具空間</h3>
        <p className="text-xs text-[#89959b] mb-4 leading-relaxed">
          建立專屬的小工具嵌入工作區，系統將自動產生邀請碼與 QR Code 供快速分享。
        </p>

        {error && (
          <div className="mb-3.5 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-notebook-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1f2a2e] mb-1">
              空間名稱 <span className="text-[#e17b62]">*</span>
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
            <label className="block text-xs font-semibold text-[#1f2a2e] mb-1">
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
            <label className="block text-xs font-semibold text-[#1f2a2e] mb-1.5">
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
                        ? 'border-[#e17b62] bg-[#fff9f6] shadow-xs'
                        : 'border-[#e4e8e5] hover:border-[#89959b]/50 bg-white'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-[#fff0eb] text-[#e17b62]' : 'bg-[#f5f7f6] text-[#89959b]'}`}>
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className={`text-xs font-bold ${isSelected ? 'text-[#e17b62]' : 'text-[#1f2a2e]'}`}>
                        {opt.label}
                      </div>
                      <div className="text-[10px] text-[#89959b] truncate">
                        {opt.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0f2f1]">
            <button
              type="button"
              onClick={onClose}
              className="notebook-btn-secondary text-xs"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="notebook-btn-primary text-xs"
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
