import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import LoginCard from './components/LoginCard';
import Navbar from './components/Navbar';
import SpaceDashboard from './components/SpaceDashboard';
import SpaceLayout from './components/SpaceLayout';
import AddToolModal from './components/AddToolModal';
import EditToolModal from './components/EditToolModal';
import CreateSpaceModal from './components/CreateSpaceModal';
import SpaceSettingsModal from './components/SpaceSettingsModal';
import JoinSpaceModal from './components/JoinSpaceModal';
import QRCodeModal from './components/QRCodeModal';
import { api } from './utils/api';

export default function App() {
  const { user, loading: authLoading } = useAuth();

  const [currentView, setCurrentView] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('space') || params.get('share')) ? 'space' : 'dashboard';
  });
  const [spaces, setSpaces] = useState([]);
  const [currentSpace, setCurrentSpace] = useState(null);
  const [tools, setTools] = useState([]);
  const [layout, setLayout] = useState('grid');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('notebook_theme') || 'warm';
  });
  const [lastLightTheme, setLastLightTheme] = useState(() => {
    const saved = localStorage.getItem('notebook_last_light_theme');
    if (saved && saved !== 'dark') return saved;
    const current = localStorage.getItem('notebook_theme');
    return current && current !== 'dark' ? current : 'warm';
  });
  const [loadingSpace, setLoadingSpace] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalSection, setAddModalSection] = useState('一般工具');
  const [editingTool, setEditingTool] = useState(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState('appearance');
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // 空間延伸狀態 (我的最愛、垃圾桶回收、最近存取紀錄)
  const [favoriteSpaceIds, setFavoriteSpaceIds] = useState(() => {
    try {
      const saved = localStorage.getItem('notebook_favorite_spaces');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [trashSpaceIds, setTrashSpaceIds] = useState(() => {
    try {
      const saved = localStorage.getItem('notebook_trash_spaces');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [archivedSpaceIds, setArchivedSpaceIds] = useState(() => {
    try {
      const saved = localStorage.getItem('notebook_archived_spaces');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentAccessMap, setRecentAccessMap] = useState(() => {
    try {
      const saved = localStorage.getItem('notebook_recent_access');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [addModalTab, setAddModalTab] = useState('templates');

  // 主題切換與 DOM 根節點同步
  useEffect(() => {
    document.documentElement.className = `theme-${theme}${theme === 'dark' ? ' dark' : ''}`;
  }, [theme]);

  const handleSelectTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('notebook_theme', newTheme);
    if (newTheme !== 'dark') {
      setLastLightTheme(newTheme);
      localStorage.setItem('notebook_last_light_theme', newTheme);
    }
  };

  const handleToggleDarkMode = () => {
    if (theme === 'dark') {
      handleSelectTheme(lastLightTheme || 'warm');
    } else {
      handleSelectTheme('dark');
    }
  };

  // 本地置頂、標籤、便箋色彩與分欄貨架存取輔助
  const getSpacePinnedIds = (spaceId) => {
    try {
      const data = localStorage.getItem(`notebook_pinned_${spaceId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const getSpaceTagsMap = (spaceId) => {
    try {
      const data = localStorage.getItem(`notebook_tags_${spaceId}`);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const getSpaceColorsMap = (spaceId) => {
    try {
      const data = localStorage.getItem(`notebook_colors_${spaceId}`);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const getSpaceSectionsMap = (spaceId) => {
    try {
      const data = localStorage.getItem(`notebook_sections_${spaceId}`);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const saveSpacePinnedIds = (spaceId, ids) => {
    localStorage.setItem(`notebook_pinned_${spaceId}`, JSON.stringify(ids));
  };

  const saveSpaceTagsMap = (spaceId, map) => {
    localStorage.setItem(`notebook_tags_${spaceId}`, JSON.stringify(map));
  };

  const saveSpaceColorsMap = (spaceId, map) => {
    localStorage.setItem(`notebook_colors_${spaceId}`, JSON.stringify(map));
  };

  const saveSpaceSectionsMap = (spaceId, map) => {
    localStorage.setItem(`notebook_sections_${spaceId}`, JSON.stringify(map));
  };

  // 載入特定空間的詳情與工具清單 (同步附加置頂、標籤、手帳色與分欄狀態)
  const loadSpaceDetail = useCallback(async (spaceId) => {
    setLoadingSpace(true);
    try {
      const data = await api.getSpaceDetail(spaceId);
      setCurrentSpace(data.space);
      const pinnedIds = getSpacePinnedIds(spaceId);
      const tagsMap = getSpaceTagsMap(spaceId);
      const colorsMap = getSpaceColorsMap(spaceId);
      const sectionsMap = getSpaceSectionsMap(spaceId);

      const enrichedTools = (data.tools || []).map((t) => ({
        ...t,
        isPinned: pinnedIds.includes(t.id),
        tags: tagsMap[t.id] || t.tags || [],
        color: colorsMap[t.id] || t.color || 'default',
        section: sectionsMap[t.id] || t.section || '一般工具',
      }));

      setTools(enrichedTools);
      setLayout(data.space.layout || 'grid');
      setIsGuest(false);
      return data.space;
    } catch (err) {
      console.error('載入空間工具失敗:', err);
      return null;
    } finally {
      setLoadingSpace(false);
    }
  }, []);

  // 檢測 URL 訪客分享連結 (?share=SPC-XXXX)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareCode = params.get('share');
    if (!shareCode) return;

    async function loadGuestSpace() {
      setLoadingSpace(true);
      try {
        const data = await api.getSpaceByShareCode(shareCode);
        if (data?.space) {
          setCurrentSpace(data.space);
          const spaceId = data.space.id;
          const pinnedIds = getSpacePinnedIds(spaceId);
          const tagsMap = getSpaceTagsMap(spaceId);
          const colorsMap = getSpaceColorsMap(spaceId);
          const sectionsMap = getSpaceSectionsMap(spaceId);

          const enrichedTools = (data.tools || []).map((t) => ({
            ...t,
            isPinned: pinnedIds.includes(t.id),
            tags: tagsMap[t.id] || t.tags || [],
            color: colorsMap[t.id] || t.color || 'default',
            section: sectionsMap[t.id] || t.section || '一般工具',
          }));

          setTools(enrichedTools);
          setLayout(data.space.layout || 'shelf');
          setIsGuest(true);
          setCurrentView('space');
        }
      } catch (err) {
        console.error('載入訪客分享空間失敗:', err);
      } finally {
        setLoadingSpace(false);
      }
    }

    if (!user) {
      loadGuestSpace();
    }
  }, [user]);

  // 1. 使用者登入後載入其所有空間 (自建 + 透過邀請碼加入的)
  useEffect(() => {
    if (!user) return;

    async function fetchSpaces() {
      try {
        const data = await api.getSpaces();
        const loadedSpaces = data.spaces || [];
        setSpaces(loadedSpaces);

        // 檢查網址是否有指定的 space 參數
        const params = new URLSearchParams(window.location.search);
        const targetSpaceId = params.get('space');
        if (targetSpaceId) {
          await loadSpaceDetail(targetSpaceId);
          setCurrentView('space');
        } else if (params.get('share')) {
          // 訪客分享由 share effect 處理
        } else {
          // 預設進入空間主頁大廳
          setCurrentView('dashboard');
        }
      } catch (err) {
        console.error('載入空間列表失敗:', err);
      }
    }

    fetchSpaces();
  }, [user, loadSpaceDetail]);

  // 瀏覽器上一頁/下一頁歷史監聽
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const spaceId = params.get('space');
      const shareCode = params.get('share');
      if (shareCode) {
        setCurrentView('space');
      } else if (spaceId) {
        loadSpaceDetail(spaceId);
        setCurrentView('space');
      } else {
        setCurrentView('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [loadSpaceDetail]);

  // 空間切換：進入空間工作區並同步網址
  const handleSelectSpace = async (spaceId) => {
    const loaded = await loadSpaceDetail(spaceId);
    if (loaded) {
      setCurrentView('space');
      setRecentAccessMap((prev) => {
        const next = { ...prev, [spaceId]: Date.now() };
        localStorage.setItem('notebook_recent_access', JSON.stringify(next));
        return next;
      });
      const url = new URL(window.location);
      url.searchParams.set('space', spaceId);
      url.searchParams.delete('share');
      window.history.pushState({ spaceId }, '', url.toString());
    }
  };

  // 我的最愛 (星號) 切換
  const handleToggleFavoriteSpace = (spaceId) => {
    setFavoriteSpaceIds((prev) => {
      const next = prev.includes(spaceId) ? prev.filter((id) => id !== spaceId) : [...prev, spaceId];
      localStorage.setItem('notebook_favorite_spaces', JSON.stringify(next));
      return next;
    });
  };

  // 移至垃圾桶
  const handleMoveToTrash = (spaceId) => {
    setTrashSpaceIds((prev) => {
      if (prev.includes(spaceId)) return prev;
      const next = [...prev, spaceId];
      localStorage.setItem('notebook_trash_spaces', JSON.stringify(next));
      return next;
    });
  };

  // 從垃圾桶還原
  const handleRestoreFromTrash = (spaceId) => {
    setTrashSpaceIds((prev) => {
      const next = prev.filter((id) => id !== spaceId);
      localStorage.setItem('notebook_trash_spaces', JSON.stringify(next));
      return next;
    });
  };

  // 開啟設定中心與帳號編輯
  const handleOpenSettings = (initialTab = 'appearance', space = null) => {
    setSettingsInitialTab(initialTab);
    if (space) {
      setCurrentSpace(space);
    }
    setSettingsModalOpen(true);
  };

  // 返回大廳：切回主頁空間牆並清理網址參數
  const handleNavigateHome = () => {
    setCurrentView('dashboard');
    const url = new URL(window.location);
    url.searchParams.delete('space');
    url.searchParams.delete('share');
    window.history.pushState({}, '', url.toString());
  };

  // 切換置頂釘選狀態
  const handleTogglePin = (toolId) => {
    if (!currentSpace) return;
    setTools((prev) => {
      const updated = prev.map((t) => (t.id === toolId ? { ...t, isPinned: !t.isPinned } : t));
      const pinnedIds = updated.filter((t) => t.isPinned).map((t) => t.id);
      saveSpacePinnedIds(currentSpace.id, pinnedIds);
      return updated;
    });
  };

  // 3. 建立新空間
  const handleCreateSpace = async (spaceData) => {
    try {
      const payload = typeof spaceData === 'string'
        ? { name: spaceData, layout: 'shelf' }
        : spaceData;
      const data = await api.createSpace(payload);
      setSpaces((prev) => [data.space, ...prev]);
      await handleSelectSpace(data.space.id);
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
    await handleSelectSpace(data.space.id);
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

  // 6. 切換佈局 (貨架 | 瀑布流 | 網格 | 分頁 | 折起專注)
  const handleToggleLayout = async (newLayout) => {
    setLayout(newLayout);
    if (currentSpace && isOwner) {
      try {
        await api.updateSpace(currentSpace.id, { layout: newLayout });
        setCurrentSpace((prev) => ({ ...prev, layout: newLayout }));
        setSpaces((prev) =>
          prev.map((s) => (s.id === currentSpace.id ? { ...s, layout: newLayout } : s))
        );
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

    if (currentSpace && isOwner && !isGuest) {
      try {
        await api.updateTool(currentSpace.id, toolId, { colSpan: newColSpan });
      } catch (err) {
        console.warn('儲存尺寸失敗:', err);
      }
    }
  };

  // 8.5 便箋彩色卡片更換 (Card Colors)
  const handleUpdateToolColor = async (toolId, color) => {
    if (!currentSpace) return;
    setTools((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, color } : t))
    );
    const colorsMap = getSpaceColorsMap(currentSpace.id);
    colorsMap[toolId] = color;
    saveSpaceColorsMap(currentSpace.id, colorsMap);

    if (isOwner && !isGuest) {
      try {
        await api.updateTool(currentSpace.id, toolId, { color });
      } catch (err) {
        // 本地更新成功
      }
    }
  };

  // 8.6 貨架跨欄移動與分組更新 (Shelf Move)
  const handleUpdateToolSection = async (toolId, section) => {
    if (!currentSpace) return;
    setTools((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, section } : t))
    );
    const sectionsMap = getSpaceSectionsMap(currentSpace.id);
    sectionsMap[toolId] = section;
    saveSpaceSectionsMap(currentSpace.id, sectionsMap);

    if (isOwner && !isGuest) {
      try {
        await api.updateTool(currentSpace.id, toolId, { section });
      } catch (err) {
        // 本地更新成功
      }
    }
  };

  // 9. 新增工具
  const handleAddTool = async (toolPayload) => {
    if (!currentSpace) return;
    const data = await api.addTool(currentSpace.id, toolPayload);
    const newTool = {
      ...data.tool,
      isPinned: false,
      tags: toolPayload.tags || [],
      color: toolPayload.color || 'default',
      section: toolPayload.section || '一般工具',
    };

    if (toolPayload.tags && toolPayload.tags.length > 0) {
      const tagsMap = getSpaceTagsMap(currentSpace.id);
      tagsMap[data.tool.id] = toolPayload.tags;
      saveSpaceTagsMap(currentSpace.id, tagsMap);
    }
    if (toolPayload.color) {
      const colorsMap = getSpaceColorsMap(currentSpace.id);
      colorsMap[data.tool.id] = toolPayload.color;
      saveSpaceColorsMap(currentSpace.id, colorsMap);
    }
    if (toolPayload.section) {
      const sectionsMap = getSpaceSectionsMap(currentSpace.id);
      sectionsMap[data.tool.id] = toolPayload.section;
      saveSpaceSectionsMap(currentSpace.id, sectionsMap);
    }

    setTools((prev) => [...prev, newTool]);
    setSpaces((prev) =>
      prev.map((s) =>
        s.id === currentSpace.id ? { ...s, tool_count: (s.tool_count || 0) + 1 } : s
      )
    );
  };

  // 10. 編輯工具 (就地更新代碼、標題、寬度、標籤、色彩、分欄)
  const handleUpdateTool = async (toolId, payload) => {
    if (!currentSpace) return;
    const data = await api.updateTool(currentSpace.id, toolId, payload);

    if (payload.tags !== undefined) {
      const tagsMap = getSpaceTagsMap(currentSpace.id);
      tagsMap[toolId] = payload.tags;
      saveSpaceTagsMap(currentSpace.id, tagsMap);
    }
    if (payload.color !== undefined) {
      const colorsMap = getSpaceColorsMap(currentSpace.id);
      colorsMap[toolId] = payload.color;
      saveSpaceColorsMap(currentSpace.id, colorsMap);
    }
    if (payload.section !== undefined) {
      const sectionsMap = getSpaceSectionsMap(currentSpace.id);
      sectionsMap[toolId] = payload.section;
      saveSpaceSectionsMap(currentSpace.id, sectionsMap);
    }

    setTools((prev) =>
      prev.map((t) =>
        t.id === toolId
          ? {
              ...t,
              ...data.tool,
              tags: payload.tags !== undefined ? payload.tags : t.tags,
              color: payload.color !== undefined ? payload.color : (t.color || 'default'),
              section: payload.section !== undefined ? payload.section : (t.section || '一般工具'),
            }
          : t
      )
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

  // 13. 刪除空間 (永久刪除)
  const handleDeleteSpace = async (spaceId) => {
    if (!window.confirm('確定要永久刪除這個空間嗎？空間內的所有工具都將被刪除且無法復原。')) return;
    try {
      await api.deleteSpace(spaceId);
      const remainingSpaces = spaces.filter((s) => s.id !== spaceId);
      setSpaces(remainingSpaces);
      setFavoriteSpaceIds((prev) => {
        const next = prev.filter((id) => id !== spaceId);
        localStorage.setItem('notebook_favorite_spaces', JSON.stringify(next));
        return next;
      });
      setTrashSpaceIds((prev) => {
        const next = prev.filter((id) => id !== spaceId);
        localStorage.setItem('notebook_trash_spaces', JSON.stringify(next));
        return next;
      });
      setSettingsModalOpen(false);

      if (currentSpace?.id === spaceId) {
        handleNavigateHome();
        setCurrentSpace(null);
        setTools([]);
      }
    } catch (err) {
      alert(err.message || '刪除空間失敗');
    }
  };

  // 14. 批次匯入工具清單 (含標籤、置頂、手帳色彩與分欄)
  const handleImportTools = async (spaceId, importedTools) => {
    let successCount = 0;
    const tagsMap = getSpaceTagsMap(spaceId);
    const pinnedIds = getSpacePinnedIds(spaceId);
    const colorsMap = getSpaceColorsMap(spaceId);
    const sectionsMap = getSpaceSectionsMap(spaceId);

    for (const tool of importedTools) {
      try {
        const data = await api.addTool(spaceId, {
          title: tool.title || '匯入的小工具',
          type: tool.type || 'html',
          content: tool.content || '',
          colSpan: tool.col_span || 1,
        });

        if (tool.tags && tool.tags.length > 0) {
          tagsMap[data.tool.id] = tool.tags;
        }
        if (tool.isPinned) {
          pinnedIds.push(data.tool.id);
        }
        if (tool.color) {
          colorsMap[data.tool.id] = tool.color;
        }
        if (tool.section) {
          sectionsMap[data.tool.id] = tool.section;
        }
        successCount++;
      } catch (err) {
        console.warn('匯入個別工具失敗:', tool.title, err);
      }
    }

    saveSpaceTagsMap(spaceId, tagsMap);
    saveSpacePinnedIds(spaceId, pinnedIds);
    saveSpaceColorsMap(spaceId, colorsMap);
    saveSpaceSectionsMap(spaceId, sectionsMap);
    alert(`成功匯入 ${successCount} 個小工具！`);
    loadSpaceDetail(spaceId);
  };

  // 15. 封存 / 解除封存空間
  const handleToggleArchiveSpace = (spaceId) => {
    setArchivedSpaceIds((prev) => {
      const next = prev.includes(spaceId) ? prev.filter((id) => id !== spaceId) : [...prev, spaceId];
      localStorage.setItem('notebook_archived_spaces', JSON.stringify(next));
      return next;
    });
  };

  // 16. 建立工具副本 (Duplicate)
  const handleDuplicateTool = async (tool) => {
    if (!currentSpace || !tool) return;
    try {
      const data = await api.addTool(currentSpace.id, {
        title: `${tool.title} (副本)`,
        type: tool.type || 'html',
        content: tool.content || '',
        colSpan: tool.col_span || 1,
      });

      const tagsMap = getSpaceTagsMap(currentSpace.id);
      const colorsMap = getSpaceColorsMap(currentSpace.id);
      const sectionsMap = getSpaceSectionsMap(currentSpace.id);

      if (tool.tags) tagsMap[data.tool.id] = tool.tags;
      if (tool.color) colorsMap[data.tool.id] = tool.color;
      if (tool.section) sectionsMap[data.tool.id] = tool.section;

      saveSpaceTagsMap(currentSpace.id, tagsMap);
      saveSpaceColorsMap(currentSpace.id, colorsMap);
      saveSpaceSectionsMap(currentSpace.id, sectionsMap);

      const enriched = {
        ...data.tool,
        tags: tool.tags || [],
        color: tool.color || 'default',
        section: tool.section || '一般工具',
        isPinned: false,
      };

      setTools((prev) => [...prev, enriched]);
      setSpaces((prev) =>
        prev.map((s) => (s.id === currentSpace.id ? { ...s, tool_count: (s.tool_count || 0) + 1 } : s))
      );
    } catch (err) {
      alert(err.message || '建立副本失敗');
    }
  };

  // 17. 複製工具至其他空間 (Clone to Space)
  const handleCloneToolToSpace = async (tool, targetSpaceId) => {
    if (!tool || !targetSpaceId) return;
    try {
      const data = await api.addTool(targetSpaceId, {
        title: tool.title,
        type: tool.type || 'html',
        content: tool.content || '',
        colSpan: tool.col_span || 1,
      });

      const tagsMap = getSpaceTagsMap(targetSpaceId);
      const colorsMap = getSpaceColorsMap(targetSpaceId);
      const sectionsMap = getSpaceSectionsMap(targetSpaceId);

      if (tool.tags) tagsMap[data.tool.id] = tool.tags;
      if (tool.color) colorsMap[data.tool.id] = tool.color;
      if (tool.section) sectionsMap[data.tool.id] = tool.section;

      saveSpaceTagsMap(targetSpaceId, tagsMap);
      saveSpaceColorsMap(targetSpaceId, colorsMap);
      saveSpaceSectionsMap(targetSpaceId, sectionsMap);

      setSpaces((prev) =>
        prev.map((s) => (s.id === targetSpaceId ? { ...s, tool_count: (s.tool_count || 0) + 1 } : s))
      );
      alert('已成功將小工具複製至指定空間！');
    } catch (err) {
      alert(err.message || '複製工具失敗');
    }
  };

  // 18. 從大廳範本專區加入至指定空間
  const handleAddTemplateToSpace = async (targetSpaceId, template) => {
    if (!targetSpaceId || !template) return;
    try {
      const data = await api.addTool(targetSpaceId, {
        title: template.title,
        type: 'html',
        content: template.content,
        colSpan: template.defaultColSpan || 1,
      });

      const tagsMap = getSpaceTagsMap(targetSpaceId);
      if (template.category) {
        tagsMap[data.tool.id] = [template.category];
        saveSpaceTagsMap(targetSpaceId, tagsMap);
      }

      setSpaces((prev) =>
        prev.map((s) => (s.id === targetSpaceId ? { ...s, tool_count: (s.tool_count || 0) + 1 } : s))
      );
      alert(`已將「${template.title}」加入至該手帳空間！`);
    } catch (err) {
      alert(err.message || '加入範本失敗');
    }
  };

  // 19. 從大廳以此範本新建空間
  const handleCreateSpaceFromTemplate = async (template) => {
    if (!template) return;
    try {
      const newSpaceData = await api.createSpace({
        name: `${template.title} 空間`,
        description: `以此範本建立之專屬空間：${template.description}`,
      });
      const newSpace = newSpaceData.space;

      const toolData = await api.addTool(newSpace.id, {
        title: template.title,
        type: 'html',
        content: template.content,
        colSpan: template.defaultColSpan || 1,
      });

      const tagsMap = {};
      if (template.category) {
        tagsMap[toolData.tool.id] = [template.category];
        saveSpaceTagsMap(newSpace.id, tagsMap);
      }

      newSpace.tool_count = 1;
      newSpace.is_owner = 1;
      setSpaces((prev) => [newSpace, ...prev]);

      await handleSelectSpace(newSpace);
    } catch (err) {
      alert(err.message || '以此範本新建空間失敗');
    }
  };

  // 20. 批次更新工具 (色彩、分欄、標籤)
  const handleBatchUpdateTools = async (toolIds, patch) => {
    if (!currentSpace || !toolIds || toolIds.length === 0) return;
    const tagsMap = getSpaceTagsMap(currentSpace.id);
    const colorsMap = getSpaceColorsMap(currentSpace.id);
    const sectionsMap = getSpaceSectionsMap(currentSpace.id);

    toolIds.forEach((tid) => {
      if (patch.tags !== undefined) tagsMap[tid] = patch.tags;
      if (patch.color !== undefined) colorsMap[tid] = patch.color;
      if (patch.section !== undefined) sectionsMap[tid] = patch.section;
    });

    if (patch.tags !== undefined) saveSpaceTagsMap(currentSpace.id, tagsMap);
    if (patch.color !== undefined) saveSpaceColorsMap(currentSpace.id, colorsMap);
    if (patch.section !== undefined) saveSpaceSectionsMap(currentSpace.id, sectionsMap);

    setTools((prev) =>
      prev.map((t) => {
        if (!toolIds.includes(t.id)) return t;
        return {
          ...t,
          tags: patch.tags !== undefined ? patch.tags : t.tags,
          color: patch.color !== undefined ? patch.color : t.color,
          section: patch.section !== undefined ? patch.section : t.section,
        };
      })
    );
  };

  // 21. 批次刪除工具
  const handleBatchDeleteTools = async (toolIds) => {
    if (!currentSpace || !toolIds || toolIds.length === 0) return;
    if (!window.confirm(`確定要批次刪除選取的 ${toolIds.length} 個小工具嗎？`)) return;

    for (const tid of toolIds) {
      try {
        await api.deleteTool(currentSpace.id, tid);
      } catch (err) {
        console.warn('批次刪除工具失敗:', tid, err);
      }
    }
    setTools((prev) => prev.filter((t) => !toolIds.includes(t.id)));
    setSpaces((prev) =>
      prev.map((s) =>
        s.id === currentSpace.id
          ? { ...s, tool_count: Math.max(0, (s.tool_count || 0) - toolIds.length) }
          : s
      )
    );
  };

  // 22. 重新命名分欄
  const handleRenameSection = (oldSection, newSection) => {
    if (!currentSpace || !oldSection || !newSection || oldSection === newSection) return;
    const sectionsMap = getSpaceSectionsMap(currentSpace.id);
    let changed = false;
    Object.keys(sectionsMap).forEach((tid) => {
      if (sectionsMap[tid] === oldSection) {
        sectionsMap[tid] = newSection;
        changed = true;
      }
    });
    if (changed) {
      saveSpaceSectionsMap(currentSpace.id, sectionsMap);
    }
    setTools((prev) =>
      prev.map((t) => ((t.section || '一般工具') === oldSection ? { ...t, section: newSection } : t))
    );
  };

  // 23. 刪除分欄 (內含工具歸入一般工具)
  const handleDeleteSection = (sectionName) => {
    if (!currentSpace || !sectionName || sectionName === '一般工具') return;
    const sectionsMap = getSpaceSectionsMap(currentSpace.id);
    let changed = false;
    Object.keys(sectionsMap).forEach((tid) => {
      if (sectionsMap[tid] === sectionName) {
        sectionsMap[tid] = '一般工具';
        changed = true;
      }
    });
    if (changed) {
      saveSpaceSectionsMap(currentSpace.id, sectionsMap);
    }
    setTools((prev) =>
      prev.map((t) => ((t.section || '一般工具') === sectionName ? { ...t, section: '一般工具' } : t))
    );
  };

  const isOwner = currentSpace?.is_owner === 1 || currentSpace?.user_id === user?.id;

  // 驗證載入中狀態
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center notebook-grid-bg">
        <div className="flex items-center gap-2.5 text-sm text-[var(--muted)]">
          <div className="w-5 h-5 border-2 border-[var(--coral)] border-t-transparent rounded-full animate-spin" />
          <span>載入空間工作區…</span>
        </div>
      </div>
    );
  }

  // 若尚未登入且並非訪客分享直達，顯示小本本風格登入卡片
  if (!user && !isGuest) {
    return <LoginCard />;
  }

  return (
    <div className="min-h-screen flex flex-col notebook-grid-bg">
      {/* 頂部導覽列：空間大廳 vs 空間工作區動態切換 */}
      <Navbar
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        spaces={spaces}
        currentSpace={currentSpace}
        onSelectSpace={handleSelectSpace}
        onOpenCreateModal={() => setCreateModalOpen(true)}
        onOpenJoinModal={() => setJoinModalOpen(true)}
        onAddToolClick={() => {
          setAddModalSection('一般工具');
          setAddModalOpen(true);
        }}
        onOpenSettings={(tab) => handleOpenSettings(tab || (currentView === 'space' ? 'info' : 'appearance'), currentSpace)}
        onOpenAccountSettings={() => handleOpenSettings('account', currentSpace)}
        onOpenQRCode={() => setQrModalOpen(true)}
        layout={layout}
        onToggleLayout={handleToggleLayout}
        onRegenerateCode={handleRegenerateCode}
        theme={theme}
        onSelectTheme={handleSelectTheme}
        onToggleDarkMode={handleToggleDarkMode}
        isGuest={isGuest}
      />

      {/* 主內容區塊：全螢幕自適應填滿 */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col min-h-0">
        {currentView === 'dashboard' ? (
          <SpaceDashboard
            spaces={spaces}
            favoriteSpaceIds={favoriteSpaceIds}
            trashSpaceIds={trashSpaceIds}
            archivedSpaceIds={archivedSpaceIds}
            recentAccessMap={recentAccessMap}
            onSelectSpace={handleSelectSpace}
            onCreateSpaceClick={() => setCreateModalOpen(true)}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onToggleFavorite={handleToggleFavoriteSpace}
            onToggleArchive={handleToggleArchiveSpace}
            onMoveToTrash={handleMoveToTrash}
            onRestoreFromTrash={handleRestoreFromTrash}
            onOpenQRCode={(space) => {
              setCurrentSpace(space);
              setQrModalOpen(true);
            }}
            onOpenSettings={(space, tab) => handleOpenSettings(tab || 'info', space)}
            onDeleteSpace={handleDeleteSpace}
            onAddTemplateToSpace={handleAddTemplateToSpace}
            onCreateSpaceFromTemplate={handleCreateSpaceFromTemplate}
            user={user}
          />
        ) : loadingSpace ? (
          <div className="py-24 flex items-center justify-center text-sm text-[var(--muted)] gap-2">
            <div className="w-5 h-5 border-2 border-[var(--coral)] border-t-transparent rounded-full animate-spin" />
            <span>讀取工具中…</span>
          </div>
        ) : (
          <SpaceLayout
            tools={tools}
            layout={layout}
            onDeleteTool={handleDeleteTool}
            onEditTool={(tool) => setEditingTool(tool)}
            onOpenAddModal={(section, tab) => {
              const safeSection = typeof section === 'string' && section.trim() ? section.trim() : '一般工具';
              setAddModalSection(safeSection);
              if (tab) setAddModalTab(tab);
              setAddModalOpen(true);
            }}
            onToggleColSpan={handleToggleColSpan}
            onTogglePin={handleTogglePin}
            onChangeColor={handleUpdateToolColor}
            onUpdateToolSection={handleUpdateToolSection}
            onReorderTools={handleReorderTools}
            onDuplicateTool={handleDuplicateTool}
            onCloneToolToSpace={handleCloneToolToSpace}
            onBatchUpdateTools={handleBatchUpdateTools}
            onBatchDeleteTools={handleBatchDeleteTools}
            onRenameSection={handleRenameSection}
            onDeleteSection={handleDeleteSection}
            availableSpaces={spaces.filter((s) => s.id !== currentSpace?.id && !trashSpaceIds.includes(s.id))}
            isOwner={!isGuest && isOwner}
          />
        )}
      </main>

      {/* 建立新空間對話框 */}
      <CreateSpaceModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateSpace={handleCreateSpace}
      />

      {/* 貼上 / 範本新增工具對話框 */}
      <AddToolModal
        isOpen={addModalOpen}
        initialSection={addModalSection}
        initialTab={addModalTab}
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
        initialTab={settingsInitialTab}
        space={currentSpace}
        tools={tools}
        user={user}
        onClose={() => setSettingsModalOpen(false)}
        onUpdateSpace={handleUpdateSpace}
        onDeleteSpace={handleDeleteSpace}
        onImportTools={handleImportTools}
        isOwner={!isGuest && isOwner}
        theme={theme}
        onSelectTheme={handleSelectTheme}
        layout={layout}
        onToggleLayout={handleToggleLayout}
        isArchived={Boolean(currentSpace && archivedSpaceIds.includes(currentSpace.id))}
        onToggleArchive={handleToggleArchiveSpace}
      />

      {/* 輸入邀請碼加入空間對話框 */}
      <JoinSpaceModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onJoinSuccess={handleJoinSpace}
      />

      {/* 一鍵 QR Code 與訪客分享對話框 */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        space={currentSpace}
      />
    </div>
  );
}
