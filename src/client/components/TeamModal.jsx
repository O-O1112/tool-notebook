import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
  RotateCcw,
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Sparkles,
  QrCode,
  LogOut,
  Info,
} from 'lucide-react';
import QRCodeView from './QRCodeView';

export default function TeamModal({
  space,
  currentUser,
  onClose,
  onToolRestored,
  onLeaveSpaceSuccess,
}) {
  const [activeTab, setActiveTab] = useState('members'); // 'members' | 'invite' | 'trash'
  const [members, setMembers] = useState([]);
  const [trashTools, setTrashTools] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingTrash, setLoadingTrash] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const apiBase = import.meta.env.VITE_API_BASE || '/api';
  const isOwner = space?.is_owner === 1 || space?.user_role === 'owner';

  // 讀取團隊成員清單
  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBase}/spaces/${space.id}/members`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      } else {
        // 本地示範模擬
        setMembers([
          { user_id: space.user_id, username: 'owner', display_name: space.owner_name || '空間建立者', role: 'owner', is_owner: 1 },
          { user_id: currentUser?.id || 999, username: currentUser?.username || 'me', display_name: currentUser?.displayName || '您', role: 'editor', is_owner: 0 },
        ]);
      }
    } catch (e) {
      setMembers([
        { user_id: space.user_id, username: 'owner', display_name: space.owner_name || '空間建立者', role: 'owner', is_owner: 1 },
      ]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // 讀取回收庫已刪除工具
  const fetchTrash = async () => {
    setLoadingTrash(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBase}/spaces/${space.id}/tools/trash`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setTrashTools(data.trash || []);
      }
    } catch (e) {
      setTrashTools([]);
    } finally {
      setLoadingTrash(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [space.id]);

  useEffect(() => {
    if (activeTab === 'trash') {
      fetchTrash();
    }
  }, [activeTab]);

  // 修改成員角色 (Owner 專用)
  const handleChangeRole = async (targetUserId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBase}/spaces/${space.id}/members/${targetUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ targetRole: newRole }),
      });
      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) => (m.user_id === targetUserId ? { ...m, role: newRole } : m))
        );
        showToast('成員權限已成功更新');
      }
    } catch (e) {
      showToast('更新失敗，請稍後再試');
    }
  };

  // 踢除成員 / 退出空間
  const handleRemoveMember = async (targetUserId, isSelf = false) => {
    const confirmText = isSelf ? '確定要退出此共享空間嗎？' : '確定要將該成員移出此空間嗎？';
    if (!window.confirm(confirmText)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBase}/spaces/${space.id}/members/${targetUserId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        if (isSelf) {
          if (onLeaveSpaceSuccess) onLeaveSpaceSuccess();
          onClose();
        } else {
          setMembers((prev) => prev.filter((m) => m.user_id !== targetUserId));
          showToast('成員已成功移出空間');
        }
      }
    } catch (e) {
      showToast('操作失敗');
    }
  };

  // 復原小工具 (Undo / Restore)
  const handleRestoreTool = async (toolId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBase}/spaces/${space.id}/tools/${toolId}/restore`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setTrashTools((prev) => prev.filter((t) => t.id !== toolId));
        if (onToolRestored) onToolRestored(data.tool);
        showToast('小工具已成功復原回空間！');
      }
    } catch (e) {
      showToast('復原失敗');
    }
  };

  // 重新產生邀請碼
  const handleRegenerateCode = async () => {
    if (!window.confirm('重新產生後，原邀請碼將立即失效，確定嗎？')) return;
    setIsRegenerating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBase}/spaces/${space.id}/regenerate-code`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        space.invite_code = data.inviteCode;
        showToast('新邀請碼已產生！');
      }
    } catch (e) {
      showToast('操作失敗');
    } finally {
      setIsRegenerating(false);
    }
  };

  const showToast = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const shareUrl = `${window.location.origin}${window.location.pathname}?share=${space.invite_code}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11151a]/60 backdrop-blur-sm animate-fadeIn">
      <div className="notebook-modal-box w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden shadow-2xl">
        {/* 頂部 Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[var(--paper)]/50">
          <div className="flex items-center gap-3">
            <div className="notebook-modal-badge text-[#3b827e]">
              <Users size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--ink)]">團隊協作與權限管理</h3>
              <p className="text-[11px] text-[var(--muted)]">
                空間「{space.name}」• 共編成員、權限分級與歷史復原庫
              </p>
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

        {/* 標籤頁籤切換 */}
        <div className="flex items-center border-b border-[var(--line)] px-6 bg-[var(--card-bg)] text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('members')}
            className={`py-3 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'members'
                ? 'border-[var(--coral)] text-[var(--coral)]'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <UserCheck size={14} />
            <span>團隊成員 ({members.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('invite')}
            className={`py-3 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'invite'
                ? 'border-[var(--coral)] text-[var(--coral)]'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <KeyRound size={14} />
            <span>協作邀請碼</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trash')}
            className={`py-3 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'trash'
                ? 'border-[var(--coral)] text-[var(--coral)]'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <RotateCcw size={14} />
            <span>已刪除工具復原庫</span>
          </button>
        </div>

        {/* 浮動提示 Toast */}
        {statusMessage && (
          <div className="bg-emerald-50 text-emerald-800 border-b border-emerald-200 px-6 py-2 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check size={14} />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* 內容區 */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'members' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span>成員帳號與角色</span>
                <span>權限分級</span>
              </div>

              {loadingMembers ? (
                <div className="p-8 text-center text-xs text-[var(--muted)] animate-pulse">載入成員清單中…</div>
              ) : (
                <div className="space-y-2">
                  {members.map((m) => {
                    const isCurrentUser = m.user_id === currentUser?.id;
                    return (
                      <div
                        key={m.user_id}
                        className="p-3 rounded-2xl bg-[var(--paper)] border border-[var(--line)] flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-[var(--card-bg)] border border-[var(--line)] flex items-center justify-center font-bold text-[var(--ink)] shrink-0">
                            {(m.display_name || m.username || '友').slice(0, 1)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[var(--ink)] truncate">
                                {m.display_name || m.username}
                              </span>
                              {isCurrentUser && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[var(--coral-light)] text-[var(--coral)] font-bold">
                                  您
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[var(--muted)]">@{m.username}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {m.is_owner === 1 ? (
                            <span className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[11px] flex items-center gap-1">
                              <ShieldCheck size={12} />
                              <span>擁有者</span>
                            </span>
                          ) : isOwner ? (
                            // 擁有者可切換其他成員權限
                            <div className="flex items-center gap-1.5">
                              <select
                                value={m.role || 'editor'}
                                onChange={(e) => handleChangeRole(m.user_id, e.target.value)}
                                className="notebook-input text-xs py-1 px-2 rounded-xl bg-[var(--card-bg)]"
                              >
                                <option value="editor">協作者 (可編排)</option>
                                <option value="viewer">檢視者 (唯讀)</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => handleRemoveMember(m.user_id, false)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                title="移出成員"
                              >
                                <UserX size={14} />
                              </button>
                            </div>
                          ) : (
                            // 一般成員檢視
                            <span
                              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                                m.role === 'viewer'
                                  ? 'bg-slate-100 text-slate-600'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {m.role === 'viewer' ? '檢視者' : '協作者'}
                            </span>
                          )}

                          {!isOwner && isCurrentUser && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(m.user_id, true)}
                              className="notebook-btn-secondary py-1 px-2 text-[11px] text-red-500 flex items-center gap-1"
                            >
                              <LogOut size={12} />
                              <span>退出空間</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'invite' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-[var(--paper)] border border-[var(--line)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--ink)]">空間協作邀請碼</span>
                  {isOwner && (
                    <button
                      type="button"
                      onClick={handleRegenerateCode}
                      disabled={isRegenerating}
                      className="text-[11px] text-[var(--coral)] hover:underline flex items-center gap-1"
                    >
                      <RefreshCw size={11} className={isRegenerating ? 'animate-spin' : ''} />
                      <span>重設代碼</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--line)]">
                  <span className="font-mono text-xl font-bold tracking-widest text-[var(--coral)]">
                    {space.invite_code || 'SPC-XXXX'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(space.invite_code);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="notebook-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1"
                  >
                    {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedCode ? '已複製' : '複製代碼'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                  將此邀請碼發送給團隊夥伴，於大廳點擊「輸入邀請碼加入」即可立即進入並共同編輯此手帳空間。
                </p>
              </div>

              {/* 協作直達連結與 QR Code */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[var(--paper)] border border-[var(--line)]">
                <div className="p-2 bg-white rounded-xl border border-[var(--line)] shadow-inner shrink-0">
                  <QRCodeView value={shareUrl} size={110} />
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  <span className="text-xs font-bold text-[var(--ink)]">一鍵邀請直達連結</span>
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="notebook-input text-xs w-full py-1.5 font-mono select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="notebook-btn-primary px-4 py-1.5 text-xs flex items-center gap-1.5"
                  >
                    {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedLink ? '連結已複製！' : '複製直達邀請連結'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trash' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span>已刪除之小工具清單</span>
                <span>操作</span>
              </div>

              {loadingTrash ? (
                <div className="p-8 text-center text-xs text-[var(--muted)] animate-pulse">正在檢查回收庫…</div>
              ) : trashTools.length === 0 ? (
                <div className="p-10 text-center space-y-2 rounded-2xl bg-[var(--paper)] border border-[var(--line)]">
                  <RotateCcw size={28} className="mx-auto text-[var(--muted)] opacity-50" />
                  <p className="text-xs font-bold text-[var(--ink)]">回收庫空空如也</p>
                  <p className="text-[11px] text-[var(--muted)]">目前沒有任何被刪除的小工具，所有工具都在空間中安好運作。</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {trashTools.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-2xl bg-[var(--paper)] border border-[var(--line)] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-[var(--ink)] truncate">{t.title}</div>
                        <div className="text-[10px] text-[var(--muted)] flex items-center gap-2 mt-0.5">
                          <span>類型：{t.type}</span>
                          <span>•</span>
                          <span>刪除時間：{new Date(t.deleted_at).toLocaleString('zh-TW')}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRestoreTool(t.id)}
                        className="notebook-btn-primary px-3 py-1.5 text-xs flex items-center gap-1.5 shrink-0 font-bold"
                      >
                        <RotateCcw size={13} />
                        <span>復原此工具</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部 Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-[var(--line)] bg-[var(--paper)]/50">
          <button type="button" onClick={onClose} className="notebook-btn-secondary px-6 py-2 text-xs font-bold">
            關閉面板
          </button>
        </div>
      </div>
    </div>
  );
}