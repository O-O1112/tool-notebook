import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  MessageSquare,
  Activity,
  Send,
  RotateCcw,
  Clock,
  User,
  Shield,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { api } from '../utils/api';

export default function TeamChatDrawer({
  space,
  currentUser,
  isOpen,
  onClose,
  onRestoreTool,
}) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'activities'
  const [messages, setMessages] = useState([]);
  const [activities, setActivities] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchChatData = async () => {
    if (!space?.id) return;
    try {
      const data = await api.getSpaceMessages(space.id);
      if (data?.messages) {
        setMessages(data.messages);
      }
      if (data?.activities) {
        setActivities(data.activities);
      }
    } catch (err) {
      console.warn('載入團隊對話失敗:', err);
    }
  };

  useEffect(() => {
    if (isOpen && space?.id) {
      setLoading(true);
      fetchChatData().finally(() => setLoading(false));

      // 抽屜開啟時每 6 秒輕量輪詢最新討論與動態
      const timer = setInterval(fetchChatData, 6000);
      return () => clearInterval(timer);
    }
  }, [isOpen, space?.id]);

  useEffect(() => {
    if (activeTab === 'chat' && isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab, isOpen]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const content = inputText.trim();
    if (!content || !space?.id || sending) return;

    setSending(true);
    try {
      const res = await api.sendSpaceMessage(space.id, content);
      if (res?.message) {
        setMessages((prev) => [...prev, res.message]);
        setInputText('');
      }
    } catch (err) {
      alert(err.message || '發送訊息失敗');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const formatActivityText = (act) => {
    const details = typeof act.details === 'string' ? JSON.parse(act.details || '{}') : act.details || {};
    const name = act.user_name || '團隊成員';
    const toolTitle = details.title ? `「${details.title}」` : '小工具';

    switch (act.action) {
      case 'tool_create':
        return `${name} 新增了 ${toolTitle}`;
      case 'tool_update':
        return `${name} 更新了 ${toolTitle}`;
      case 'tool_delete':
        return `${name} 刪除了 ${toolTitle}（移至回收庫）`;
      case 'tool_restore':
        return `${name} 復原了 ${toolTitle}`;
      case 'member_role_update':
        return `${name} 調整了成員權限`;
      case 'member_leave':
        return `${name} 退出了空間`;
      case 'member_kick':
        return `${name} 移除了成員`;
      default:
        return `${name} 執行了操作`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* 半透明遮罩 */}
      <div
        className="absolute inset-0 bg-[#11151a]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* 右側滑出抽屜主面板 */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--card-bg)] border-l border-[var(--line)] shadow-2xl flex flex-col h-full animate-slideInRight">
          {/* 頂部 Header */}
          <div className="px-5 py-4 border-b border-[var(--line)] bg-[var(--paper)]/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[var(--coral-light)] text-[var(--coral)] flex items-center justify-center font-bold">
                <MessageSquare size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--ink)] leading-tight">
                  團隊協作討論室
                </h3>
                <p className="text-[11px] text-[var(--muted)]">
                  {space?.name || '當前空間'} 的即時討論與操作紀錄
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={fetchChatData}
                className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-lg transition-colors"
                title="重新整理討論"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-lg transition-colors"
                title="關閉討論抽屜"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* 分頁切換 (對話 vs 動態) */}
          <div className="px-5 pt-3 pb-2 border-b border-[var(--line)] flex items-center gap-2 bg-[var(--card-bg)] shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'chat'
                  ? 'bg-[var(--coral)] text-white shadow-xs'
                  : 'text-[var(--muted)] hover:bg-[var(--paper)]'
              }`}
            >
              <MessageSquare size={13} />
              <span>討論訊息 ({messages.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('activities')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'activities'
                  ? 'bg-[var(--coral)] text-white shadow-xs'
                  : 'text-[var(--muted)] hover:bg-[var(--paper)]'
              }`}
            >
              <Activity size={13} />
              <span>協作動態 ({activities.length})</span>
            </button>
          </div>

          {/* 訊息 / 動態主要捲動區 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeTab === 'chat' ? (
              messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--muted)]">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--paper)] flex items-center justify-center mb-3">
                    <MessageSquare size={22} className="text-[var(--coral)]" />
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--ink)] mb-1">
                    尚無任何團隊討論
                  </h4>
                  <p className="text-xs">
                    在下方輸入訊息，與空間的夥伴們展開即時交流。
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.user_id === currentUser?.id;
                  const isOwner = msg.sender_role === 'owner';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-[var(--muted)]">
                        <span className="font-semibold text-[var(--ink)]">
                          {isMe ? '我' : msg.sender_name || msg.sender_username || '成員'}
                        </span>
                        {isOwner && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
                            擁有者
                          </span>
                        )}
                        <span>{formatTime(msg.created_at)}</span>
                      </div>

                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed break-words whitespace-pre-wrap shadow-xs ${
                          isMe
                            ? 'bg-[var(--coral)] text-white rounded-br-xs'
                            : 'bg-[var(--paper)] text-[var(--ink)] border border-[var(--line)] rounded-bl-xs'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              /* 協作動態時間軸 */
              activities.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--muted)]">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--paper)] flex items-center justify-center mb-3">
                    <Activity size={22} className="text-emerald-500" />
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--ink)] mb-1">
                    尚無操作動態
                  </h4>
                  <p className="text-xs">所有工具編輯、軟刪除與復原皆會記錄於此。</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activities.map((act) => {
                    const details = typeof act.details === 'string' ? JSON.parse(act.details || '{}') : act.details || {};
                    const isDelete = act.action === 'tool_delete';
                    return (
                      <div
                        key={act.id}
                        className="p-2.5 rounded-xl bg-[var(--paper)]/60 border border-[var(--line)] flex items-start justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[var(--ink)] leading-normal font-medium">
                            {formatActivityText(act)}
                          </p>
                          <span className="text-[10px] text-[var(--muted)] flex items-center gap-1 mt-1">
                            <Clock size={10} />
                            {formatTime(act.created_at)}
                          </span>
                        </div>

                        {/* 若為刪除動態，提供快捷復原按鈕 */}
                        {isDelete && details.toolId && onRestoreTool && (
                          <button
                            type="button"
                            onClick={() => onRestoreTool(details.toolId)}
                            className="px-2 py-1 rounded-lg bg-[var(--card-bg)] hover:bg-[var(--paper)] border border-[var(--line)] text-[var(--coral)] font-semibold text-[11px] flex items-center gap-1 shrink-0 transition-colors shadow-xs"
                            title="復原此刪除動作"
                          >
                            <RotateCcw size={11} />
                            <span>復原</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 底部對話輸入框 (僅在對話分頁顯示) */}
          {activeTab === 'chat' && (
            <div className="p-3 border-t border-[var(--line)] bg-[var(--paper)]/50 shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="輸入訊息，Enter 送出..."
                  disabled={sending}
                  className="notebook-input flex-1 text-xs py-2 px-3 rounded-xl bg-[var(--card-bg)]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="notebook-btn-primary p-2 rounded-xl shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="傳送訊息"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
