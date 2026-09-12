import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import LoginCard from './components/LoginCard';
import Navbar from './components/Navbar';
import SpaceLayout from './components/SpaceLayout';
import AddToolModal from './components/AddToolModal';
import EditToolModal from './components/EditToolModal';
import SpaceSettingsModal from './components/SpaceSettingsModal';
import JoinSpaceModal from './components/JoinSpaceModal';
import { api } from './utils/api';

export default function App() {
  const { user, loading: authLoading } = useAuth();

  const [spaces, setSpaces] = useState([]);
  const [currentSpace, setCurrentSpace] = useState(null);
  const [tools, setTools] = useState([]);
  const [layout, setLayout] = useState('grid');
  const [loadingSpace, setLoadingSpace] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  // 1. 使用者登入後載入其所有空間 (自建 + 透過邀請碼加入的)
  useEffect(() => {
    if (!user) return;

    async function fetchSpaces() {
      try {
        const data = await api.getSpaces();
        setSpaces(data.spaces || []);
        if (data.spaces && data.spaces.length > 0) {
          loadSpaceDetail(data.spaces[0].id);
        }
      } catch (err) {
        console.error('載入空間列表失敗:', err);
      }
    }

    fetchSpaces();
  }, [user]);

  // 2. 載入特定空間的詳情與工具清單
  const loadSpaceDetail = async (spaceId) => {
    setLoadingSpace(true);
    try {
      const data = await api.getSpaceDetail(spaceId);
      setCurrentSpace(data.space);
      setTools(data.tools || []);
      setLayout(data.space.layout || 'grid');
    } catch (err) {
      console.error('載入空間工具失敗:', err);
    } finally {
      setLoadingSpace(false);
    }
  };

  // 3. 建立新空間
  const handleCreateSpace = async (name) => {
    try {
      const data = await api.createSpace({ name, layout: 'grid' });
      setSpaces((prev) => [data.space, ...prev]);
      loadSpaceDetail(data.space.id);
    } catch (err) {
      alert(err.message || '建立空間失敗');
    }
  };

  // 4. 輸入邀請碼加入空間
  const handleJoinSpace = async (inviteCode) => {
    const data = await api.joinSpace(inviteCode);
    alert(data.message || '成功加入空間！');
    const listRes = await api.getSpaces();
    setSpaces(listRes.spaces || []);
    loadSpaceDetail(data.space.id);
  };

  // 5. 重新產生邀請碼
  const handleRegenerateCode = async (spaceId) => {
    if (!window.confirm('確定要重新產生邀請碼嗎？舊的代碼將立即失效。')) return;
    try {
      const data = await api.regenerateInviteCode(spaceId);
      setCurrentSpace((prev) => ({ ...prev, invite_code: data.inviteCode }));
      setSpaces((prev) =>
        prev.map((s) => (s.id === spaceId ? { ...s, invite_code: data.inviteCode } : s))
      );
      alert(`已產生新邀請碼：${data.inviteCode}`);
    } catch (err) {
      alert(err.message || '重新產生失敗');
    }
  };

  // 6. 切換佈局 (網格 | 分頁 | 折起專注)
  const handleToggleLayout = async (newLayout) => {
    setLayout(newLayout);
    if (currentSpace && isOwner) {
      try {
        await api.updateSpace(currentSpace.id, { layout: newLayout });
        setCurrentSpace((prev) => ({ ...prev, layout: newLayout }));
      } catch (err) {
        console.warn('儲存佈局設定失敗:', err);
      }
    }
  };

  // 7. 拖曳重排小工具順序
  const handleReorderTools = async (newTools) => {
    setTools(newTools);
    if (!currentSpace || !isOwner) return;

    try {
      const toolIds = newTools.map((t) => t.id);
      await api.reorderTools(currentSpace.id, toolIds);
    } catch (err) {
      console.warn('儲存排序失敗:', err);
    }
  };

  // 8. 調整卡片尺寸縮放 (1x / 2x col_span)
  const handleToggleColSpan = async (toolId, newColSpan) => {
    setTools((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, col_span: newColSpan } : t))
    );

    if (currentSpace && isOwner) {
      try {
        await api.updateTool(currentSpace.id, toolId, { colSpan: newColSpan });
      } catch (err) {
        console.warn('儲存尺寸失敗:', err);
      }
    }
  };

  // 9. 新增工具
  const handleAddTool = async (toolPayload) => {
    if (!currentSpace) return;
    const data = await api.addTool(currentSpace.id, toolPayload);
    setTools((prev) => [...prev, data.tool]);
    setSpaces((prev) =>
      prev.map((s) =>
        s.id === currentSpace.id ? { ...s, tool_count: (s.tool_count || 0) + 1 } : s
      )
    );
  };

  // 10. 編輯工具 (就地更新代碼、標題、寬度)
  const handleUpdateTool = async (toolId, payload) => {
    if (!currentSpace) return;
    const data = await api.updateTool(currentSpace.id, toolId, payload);
    setTools((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, ...data.tool } : t))
    );
  };

  // 11. 刪除工具
  const handleDeleteTool = async (toolId) => {
    if (!currentSpace) return;
    if (!window.confirm('確定要刪除這個小工具嗎？')) return;

    try {
      await api.deleteTool(currentSpace.id, toolId);
      setTools((prev) => prev.filter((t) => t.id !== toolId));
      setSpaces((prev) =>
        prev.map((s) =>
          s.id === currentSpace.id
            ? { ...s, tool_count: Math.max(0, (s.tool_count || 1) - 1) }
            : s
        )
      );
    } catch (err) {
      alert(err.message || '刪除工具失敗');
    }
  };

  // 12. 更新空間資訊 (名稱、描述)
  const handleUpdateSpace = async (spaceId, payload) => {
    const data = await api.updateSpace(spaceId, payload);
    setCurrentSpace((prev) => ({ ...prev, ...data.space }));
    setSpaces((prev) =>
      prev.map((s) => (s.id === spaceId ? { ...s, ...data.space } : s))
    );
  };

  // 13. 刪除空間
  const handleDeleteSpace = async (spaceId) => {
    try {
      await api.deleteSpace(spaceId);
      const remainingSpaces = spaces.filter((s) => s.id !== spaceId);
      setSpaces(remainingSpaces);
      setSettingsModalOpen(false);

      if (remainingSpaces.length > 0) {
        loadSpaceDetail(remainingSpaces[0].id);
      } else {
        setCurrentSpace(null);
        setTools([]);
      }
    } catch (err) {
      alert(err.message || '刪除空間失敗');
    }
  };

  // 14. 批次匯入工具清單
  const handleImportTools = async (spaceId, importedTools) => {
    let successCount = 0;
    for (const tool of importedTools) {
      try {
        await api.addTool(spaceId, {
          title: tool.title || '匯入的小工具',
          type: tool.type || 'html',
          content: tool.content || '',
          colSpan: tool.col_span || 1,
        });
        successCount++;
      } catch (err) {
        console.warn('匯入個別工具失敗:', tool.title, err);
      }
    }

    alert(`成功匯入 ${successCount} 個小工具！`);
    loadSpaceDetail(spaceId);
  };

  const isOwner = currentSpace?.is_owner === 1 || currentSpace?.user_id === user?.id;

  // 驗證載入中狀態
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center notebook-grid-bg">
        <div className="flex items-center gap-2.5 text-sm text-[#89959b]">
          <div className="w-5 h-5 border-2 border-[#e17b62] border-t-transparent rounded-full animate-spin" />
          <span>載入空間工作區…</span>
        </div>
      </div>
    );
  }

  // 若尚未登入，顯示小本本風格登入卡片
  if (!user) {
    return <LoginCard />;
  }

  return (
    <div className="min-h-screen flex flex-col notebook-grid-bg">
      {/* 頂部導覽列 */}
      <Navbar
        spaces={spaces}
        currentSpace={currentSpace}
        onSelectSpace={loadSpaceDetail}
        onCreateSpace={handleCreateSpace}
        onOpenJoinModal={() => setJoinModalOpen(true)}
        onAddToolClick={() => setAddModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        layout={layout}
        onToggleLayout={handleToggleLayout}
        onRegenerateCode={handleRegenerateCode}
      />

      {/* 主內容區塊 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {loadingSpace ? (
          <div className="py-24 flex items-center justify-center text-sm text-[#89959b] gap-2">
            <div className="w-5 h-5 border-2 border-[#e17b62] border-t-transparent rounded-full animate-spin" />
            <span>讀取工具中…</span>
          </div>
        ) : (
          <SpaceLayout
            tools={tools}
            layout={layout}
            onDeleteTool={handleDeleteTool}
            onEditTool={(tool) => setEditingTool(tool)}
            onOpenAddModal={() => setAddModalOpen(true)}
            onToggleColSpan={handleToggleColSpan}
            onReorderTools={handleReorderTools}
            isOwner={isOwner}
          />
        )}
      </main>

      {/* 貼上 / 範本新增工具對話框 */}
      <AddToolModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddTool={handleAddTool}
      />

      {/* 編輯工具對話框 */}
      <EditToolModal
        isOpen={Boolean(editingTool)}
        tool={editingTool}
        onClose={() => setEditingTool(null)}
        onSaveTool={handleUpdateTool}
      />

      {/* 空間設定與備份對話框 */}
      <SpaceSettingsModal
        isOpen={settingsModalOpen}
        space={currentSpace}
        tools={tools}
        onClose={() => setSettingsModalOpen(false)}
        onUpdateSpace={handleUpdateSpace}
        onDeleteSpace={handleDeleteSpace}
        onImportTools={handleImportTools}
        isOwner={isOwner}
      />

      {/* 輸入邀請碼加入空間對話框 */}
      <JoinSpaceModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onJoinSuccess={handleJoinSpace}
      />
    </div>
  );
}
