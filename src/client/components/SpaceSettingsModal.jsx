import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Settings,
  Palette,
  LayoutGrid,
  Kanban,
  Columns3,
  Layers,
  ListCollapse,
  Download,
  Upload,
  Trash2,
  Check,
  FileText,
  Sun,
  Moon,
  FolderCog,
  AlertTriangle,
  User,
  Info,
  ShieldCheck,
  Command,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const THEMES = [
  { key: 'warm', name: '方眼米紙', desc: '手帳方眼格紋理，溫潤護眼', color: '#fbfbf9', border: '#e4e8e5' },
  { key: 'kraft', name: '復古牛皮', desc: '典雅牛皮紙底色，溫厚手作感', color: '#f4ecdc', border: '#ddcfb7' },
  { key: 'minimal', name: '簡約素白', desc: '純白極簡無紋理，清爽俐落', color: '#ffffff', border: '#e8e8e8' },
];

const LAYOUT_OPTIONS = [
  { key: 'shelf', label: '貨架分欄', desc: '看板分欄分類', icon: Kanban },
  { key: 'wall', label: '緊湊瀑布流', desc: '無縫高矮自適應', icon: Columns3 },
  { key: 'grid', label: '網格並排', desc: '支援自由重排與縮放', icon: LayoutGrid },
  { key: 'tabs', label: '分頁輪播', desc: '橫向切換小工具', icon: Layers },
  { key: 'collapsed', label: '折起專注', desc: '純清單點擊展開', icon: ListCollapse },
];

export default function SpaceSettingsModal({
  isOpen,
  initialTab = 'appearance',
  space,
  tools = [],
  user: propUser,
  onClose,
  onUpdateSpace,
  onDeleteSpace,
  onImportTools,
  isOwner = true,
  theme = 'warm',
  onSelectTheme,
  layout = 'shelf',
  onToggleLayout,
}) {
  const { user: authUser, updateProfile, logout } = useAuth();
  const currentUser = propUser || authUser;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);

  // 帳號編輯表單狀態
  const [editDisplayName, setEditDisplayName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (currentUser) {
      setEditDisplayName(currentUser.displayName || currentUser.display_name || '');
    }
  }, [currentUser, isOpen]);

  useEffect(() => {
    if (space) {
      setName(space.name || '');
      setDescription(space.description || '');
      setDeleteConfirm(false);
    }
  }, [space, isOpen]);

  if (!isOpen) return null;

  const isDarkMode = theme === 'dark';

  // 空間資料儲存
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!space || !name.trim()) return;

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

  // 個人暱稱與帳號資訊儲存
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editDisplayName.trim()) return;

    setSavingProfile(true);
    setProfileSuccessMsg('');
    setProfileErrorMsg('');
    try {
      await updateProfile({ displayName: editDisplayName.trim() });
      setProfileSuccessMsg('個人暱稱已成功更新！');
      setTimeout(() => setProfileSuccessMsg(''), 3000);
    } catch (err) {
      setProfileErrorMsg(err.message || '更新個人資料失敗');
    } finally {
      setSavingProfile(false);
    }
  };

  // 匯出目前空間所有工具為 JSON
  const handleExportJSON = () => {
    if (!space) return;
    const exportData = {
      version: '2.2.0',
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
        color: t.color || 'default',
        section: t.section || '一般工具',
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
    if (!space) return;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2a2e]/60 backdrop-blur-sm animate-fadeIn">
      <div className="notebook-card w-full max-w-xl bg-[var(--card-bg)] border border-[var(--line)] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal 頂部標題列 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line,#e4e8e5)]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e17b62]" />
            <h2 className="text-base font-bold text-[var(--ink,#1f2a2e)] flex items-center gap-2">
              <Settings size={17} className="text-[#e17b62]" />
              <span>系統與手帳空間設定中心</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--muted,#89959b)] hover:text-[var(--ink,#1f2a2e)] hover:bg-[var(--paper,#f5f7f6)] rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 6 頁籤列 */}
        <div className="flex items-center gap-1.5 px-6 pt-3 pb-2 border-b border-[var(--line,#e4e8e5)] bg-[var(--paper,#f5f7f6)]/40 overflow-x-auto text-xs scrollbar-none">
          {/* 1. 個人帳號 */}
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'account'
                ? 'bg-[var(--card-bg)] text-[#e17b62] font-bold shadow-xs border border-[var(--line,#e4e8e5)]'
                : 'text-[var(--muted,#89959b)] hover:text-[var(--ink,#1f2a2e)]'
            }`}
          >
            <User size={13} />
            <span>個人帳號</span>
          </button>

          {/* 2. 外觀風格 */}
          <button
            type="button"
            onClick={() => setActiveTab('appearance')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'appearance'
                ? 'bg-[var(--card-bg)] text-[#e17b62] font-bold shadow-xs border border-[var(--line,#e4e8e5)]'
                : 'text-[var(--muted,#89959b)] hover:text-[var(--ink,#1f2a2e)]'
            }`}
          >
            <Palette size={13} />
            <span>外觀與風格</span>
          </button>

          {/* 3. 空間管理 (僅當有選定空間時) */}
          {space && (
            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'info'
                  ? 'bg-[var(--card-bg)] text-[#e17b62] font-bold shadow-xs border border-[var(--line,#e4e8e5)]'
                  : 'text-[var(--muted,#89959b)] hover:text-[var(--ink,#1f2a2e)]'
              }`}
            >
              <FolderCog size={13} />
              <span>空間管理</span>
            </button>
          )}

          {/* 4. 資料備份 (僅當有選定空間時) */}
          {space && (
            <button
              type="button"
              onClick={() => setActiveTab('backup')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'backup'
                  ? 'bg-[var(--card-bg)] text-[#e17b62] font-bold shadow-xs border border-[var(--line,#e4e8e5)]'
                  : 'text-[var(--muted,#89959b)] hover:text-[var(--ink,#1f2a2e)]'
              }`}
            >
              <FileText size={13} />
              <span>資料備份</span>
            </button>
          )}

          {/* 5. 關於系統 */}
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'about'
                ? 'bg-[var(--card-bg)] text-[#e17b62] font-bold shadow-xs border border-[var(--line,#e4e8e5)]'
                : 'text-[var(--muted,#89959b)] hover:text-[var(--ink,#1f2a2e)]'
            }`}
          >
            <Info size={13} />
            <span>關於系統</span>
          </button>

          {/* 6. 危險操作 (僅空間擁有者) */}
          {space && isOwner && (
            <button
              type="button"
              onClick={() => setActiveTab('danger')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'danger'
                  ? 'bg-red-500/10 text-red-500 font-bold shadow-xs border border-red-500/30'
                  : 'text-[var(--muted,#89959b)] hover:text-red-500'
              }`}
            >
              <Trash2 size={13} />
              <span>危險操作</span>
            </button>
          )}
        </div>

        {/* 內容區塊 */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* 頁籤 1：個人帳號管理 (Account) */}
          {activeTab === 'account' && (
            <div className="space-y-6 animate-fadeIn">
              {/* 使用者名片頭像展示 */}
              <div className="p-4 rounded-xl bg-[var(--paper,#f5f7f6)] border border-[var(--line,#e4e8e5)] flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#fff0eb] border border-[#f7d2c8] flex items-center justify-center text-[#e17b62] font-extrabold text-xl shadow-xs shrink-0">
                  {(editDisplayName || currentUser?.username || '用').slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[var(--ink,#1f2a2e)] truncate">
                      {currentUser?.displayName || currentUser?.display_name || currentUser?.username || '未登入'}
                    </span>
                    <span className="notebook-badge bg-[#fff4f0] text-[#e17b62] border-[#f7d2c8]">
                      {currentUser?.role === 'teacher' ? '教師' : '手帳管理者'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--muted,#89959b)] mt-0.5 font-mono">
                    @{currentUser?.username || 'guest'}
                  </p>
                </div>
              </div>

              {/* 修改顯示暱稱表單 */}
              <form onSubmit={handleSaveProfile} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[var(--ink,#1f2a2e)] mb-1.5">
                    修改顯示暱稱 (首頁大廳迎賓名稱)
                  </label>
                  <input
                    type="text"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    placeholder="輸入您的個人暱稱，例如：郭立宇"
                    className="notebook-input w-full"
                    maxLength={30}
                    required
                  />
                  <p className="text-[10px] text-[var(--muted,#89959b)] mt-1">
                    暱稱將顯示於大廳左側邊欄、頂部導覽列及協作清單中，登出後仍會自動記住。
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--muted,#89959b)] mb-1.5">
                    帳號使用者名稱 (不可變更)
                  </label>
                  <input
                    type="text"
                    value={currentUser?.username || ''}
                    disabled
                    className="notebook-input w-full bg-[var(--paper,#f5f7f6)]/70 text-[var(--muted,#89959b)] cursor-not-allowed"
                  />
                </div>

                {profileSuccessMsg && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                    <Check size={14} className="shrink-0" />
                    <span>{profileSuccessMsg}</span>
                  </div>
                )}

                {profileErrorMsg && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>{profileErrorMsg}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  {logout && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        logout();
                      }}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={13} />
                      <span>登出帳號</span>
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={savingProfile || !editDisplayName.trim()}
                    className="notebook-btn-primary text-xs py-2 px-4 ml-auto flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>{savingProfile ? '儲存中…' : '儲存個人暱稱'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 頁籤 2：外觀與風格調節 (Appearance) */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-fadeIn">
              {/* 深色模式切換 */}
              <div>
                <label className="block text-xs font-bold text-[var(--ink,#1f2a2e)] mb-2">
                  明暗色彩模式
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectTheme) {
                        const savedLight = localStorage.getItem('notebook_last_light_theme') || 'warm';
                        onSelectTheme(savedLight);
                      }
                    }}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                      !isDarkMode
                        ? 'border-[#e17b62] bg-[#fff9f6] text-[#e17b62] shadow-xs font-bold'
                        : 'border-[var(--line,#e4e8e5)] bg-[var(--paper,#f5f7f6)] text-[var(--muted,#89959b)] hover:border-[#e17b62]/40'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Sun size={17} />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold">日間手帳模式</div>
                      <div className="text-[10px] opacity-75">溫潤紙質，清晰可讀</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTheme && onSelectTheme('dark')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                      isDarkMode
                        ? 'border-[#e17b62] bg-[#1c222b] text-[#e57d66] shadow-xs font-bold'
                        : 'border-[var(--line,#e4e8e5)] bg-[var(--paper,#f5f7f6)] text-[var(--muted,#89959b)] hover:border-[#e17b62]/40'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center shrink-0">
                      <Moon size={17} />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold">深邃夜墨模式</div>
                      <div className="text-[10px] opacity-75">護眼暗黑，沉浸專注</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 手帳紙質底色選擇 */}
              <div>
                <label className="block text-xs font-bold text-[var(--ink,#1f2a2e)] mb-2">
                  手帳紙質風格底色
                  {isDarkMode && (
                    <span className="ml-2 font-normal text-[11px] text-[var(--muted,#89959b)]">
                      (目前處於深色模式，切回日間模式時將套用所選紙質)
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {THEMES.map((t) => {
                    const isSelected = !isDarkMode && theme === t.key;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => onSelectTheme && onSelectTheme(t.key)}
                        className={`p-3 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-[#e17b62] bg-[#fff9f6] ring-1 ring-[#e17b62]'
                            : 'border-[var(--line,#e4e8e5)] hover:border-[#e17b62]/40 bg-[var(--card-bg)]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="w-4 h-4 rounded-full border shadow-xs"
                            style={{ backgroundColor: t.color, borderColor: t.border }}
                          />
                          {isSelected && <span className="text-xs font-bold text-[#e17b62]">✓</span>}
                        </div>
                        <div className="text-xs font-bold text-[var(--ink,#1f2a2e)]">{t.name}</div>
                        <div className="text-[10px] text-[var(--muted,#89959b)] mt-0.5 leading-relaxed">{t.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 預設排版模式偏好 */}
              {onToggleLayout && (
                <div>
                  <label className="block text-xs font-bold text-[var(--ink,#1f2a2e)] mb-2">
                    空間排版模式
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {LAYOUT_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = layout === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => onToggleLayout(opt.key)}
                          className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                            isSelected
                              ? 'border-[#e17b62] bg-[#fff9f6] text-[#e17b62] font-semibold'
                              : 'border-[var(--line,#e4e8e5)] hover:border-[#e17b62]/40 text-[var(--ink,#1f2a2e)]'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              isSelected ? 'bg-[#e17b62] text-white' : 'bg-[var(--paper,#f5f7f6)] text-[var(--muted,#89959b)]'
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate">{opt.label}</div>
                            <div className="text-[10px] text-[var(--muted,#89959b)] truncate">{opt.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 頁籤 3：空間管理 (Info) */}
          {activeTab === 'info' && space && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink,#1f2a2e)] mb-1.5">
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
                <label className="block text-xs font-semibold text-[var(--ink,#1f2a2e)] mb-1.5">
                  空間備註說明
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="為這個空間加入簡述或備忘…"
                  className="notebook-input w-full resize-none text-xs"
                  disabled={!isOwner}
                />
              </div>

              {space.invite_code && (
                <div className="p-3 rounded-xl bg-[var(--paper,#f5f7f6)] border border-[var(--line,#e4e8e5)] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[var(--muted,#89959b)] block">空間邀請碼</span>
                    <span className="font-mono font-bold text-sm text-[#e17b62] tracking-wider">{space.invite_code}</span>
                  </div>
                </div>
              )}

              {isOwner && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitting || !name.trim()}
                    className="notebook-btn-primary text-xs py-2 px-4"
                  >
                    <Check size={14} />
                    <span>{submitting ? '儲存中…' : '儲存空間設定'}</span>
                  </button>
                </div>
              )}
            </form>
          )}

          {/* 頁籤 4：資料備份 (Backup) */}
          {activeTab === 'backup' && space && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-[var(--paper,#f5f7f6)] border border-[var(--line,#e4e8e5)] space-y-3">
                <h4 className="text-xs font-bold text-[var(--ink,#1f2a2e)] flex items-center gap-1.5">
                  <FileText size={15} className="text-[#e17b62]" />
                  <span>工具資料轉移與 JSON 封裝</span>
                </h4>
                <p className="text-[11px] text-[var(--muted,#89959b)] leading-relaxed">
                  將目前空間內的 {tools.length} 個小工具（包含自訂 HTML/JS、Iframe 配置、色票便箋與釘選狀態）打包為標準 JSON 檔案，供離線保存或轉移至其他空間。
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    disabled={tools.length === 0}
                    className="notebook-btn-secondary text-xs py-2 justify-center flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    <span>匯出工具備份 ({tools.length})</span>
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
                      >
                        <Upload size={14} />
                        <span>匯入工具清單</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 頁籤 5：關於系統 (About) */}
          {activeTab === 'about' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-xl bg-[var(--paper,#f5f7f6)] border border-[var(--line,#e4e8e5)] space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="brand-mark w-8 h-8">
                    <Info size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[var(--ink,#1f2a2e)]">工具小本本 Class Notebook</h3>
                    <p className="text-[10px] text-[var(--muted,#89959b)]">版本 v2.2.0 • 手帳風格多空間工作平台</p>
                  </div>
                </div>
                <p className="text-[11px] text-[var(--muted,#89959b)] leading-relaxed">
                  專為敏捷工作與個人筆記設計的極簡空間，融合經典手帳手作感、多欄貨架排版以及即時工具嵌入。
                </p>
              </div>

              {/* 沙盒安全隔離說明 */}
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                  <ShieldCheck size={15} />
                  <span>100% 嚴格安全隔離沙盒 (Iframe Sandbox)</span>
                </div>
                <p className="text-[10px] text-emerald-700 leading-relaxed">
                  所有嵌入的自訂 HTML/JS 小工具均在嚴格隔離的 Iframe 沙盒中運行，不存取主站 Cookie 與 LocalStorage，杜絕 XSS 與跨站隱私外洩風險。
                </p>
              </div>

              {/* 快捷鍵與操作提示 */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[var(--ink,#1f2a2e)] flex items-center gap-1.5">
                  <Command size={13} className="text-[#e17b62]" />
                  <span>常用操作提示</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-[var(--paper,#f5f7f6)] flex items-center justify-between">
                    <span className="text-[var(--muted,#89959b)]">加入我的最愛</span>
                    <span className="font-medium text-[var(--ink,#1f2a2e)]">點擊卡片 ⭐ 圖示</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--paper,#f5f7f6)] flex items-center justify-between">
                    <span className="text-[var(--muted,#89959b)]">調整卡片大小</span>
                    <span className="font-medium text-[var(--ink,#1f2a2e)]">卡片右上角 1x / 2x</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--paper,#f5f7f6)] flex items-center justify-between">
                    <span className="text-[var(--muted,#89959b)]">變更便箋色彩</span>
                    <span className="font-medium text-[var(--ink,#1f2a2e)]">點擊便箋右上色彩圓點</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--paper,#f5f7f6)] flex items-center justify-between">
                    <span className="text-[var(--muted,#89959b)]">跨欄拖曳分類</span>
                    <span className="font-medium text-[var(--ink,#1f2a2e)]">長按卡片拖動至目標欄位</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 頁籤 6：危險操作 (Danger Zone) */}
          {activeTab === 'danger' && space && isOwner && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-red-500 font-bold">
                  <AlertTriangle size={16} />
                  <span>永久刪除此空間</span>
                </div>
                <p className="text-[11px] text-[var(--muted,#89959b)] leading-relaxed">
                  此操作無法復原。刪除後，空間內所有建立的自訂工具與配置都將被永久銷毀，成員也將立即失去存取權限。
                </p>

                <div className="pt-2">
                  {!deleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(true)}
                      className="notebook-btn-secondary text-xs py-1.5 px-3 text-red-500 border-red-500/40 hover:bg-red-500/20"
                    >
                      刪除空間
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(false)}
                        className="notebook-btn-secondary text-xs py-1.5 px-3"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSpace(space.id)}
                        className="notebook-btn-primary text-xs py-1.5 px-3 bg-red-600 hover:bg-red-700 border-red-600"
                      >
                        確認永久刪除
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
