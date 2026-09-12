import test from 'node:test';
import assert from 'node:assert';

test('dashboard: 空間大廳篩選 (全部、我建立的、他人共享) 邏輯驗證', () => {
  const currentUserId = 10;
  const mockSpaces = [
    { id: 1, name: '數學互動工具箱', user_id: 10, is_owner: 1, invite_code: 'SPC-MATH' },
    { id: 2, name: '物理模擬實驗室', user_id: 20, is_owner: 0, owner_name: '李老師', invite_code: 'SPC-PHYS' },
    { id: 3, name: '個人備忘草稿本', user_id: 10, is_owner: 1, invite_code: 'SPC-MEMO' },
  ];

  const owned = mockSpaces.filter((s) => s.is_owner === 1 || s.user_id === currentUserId);
  const shared = mockSpaces.filter((s) => s.is_owner !== 1 && s.user_id !== currentUserId);

  assert.strictEqual(mockSpaces.length, 3, '全部空間數量應為 3');
  assert.strictEqual(owned.length, 2, '我建立的空間應為 2');
  assert.strictEqual(shared.length, 1, '他人共享的空間應為 1');
  assert.strictEqual(shared[0].name, '物理模擬實驗室');
});

test('dashboard: 關鍵字即時搜尋過濾 (名稱、備註說明、邀請碼)', () => {
  const mockSpaces = [
    { id: 1, name: '自然科學教具', description: '顯微鏡與化學週期表', invite_code: 'SPC-CHEM' },
    { id: 2, name: '英文單字快閃卡', description: 'TOEIC 高頻核心單字', invite_code: 'SPC-ENG1' },
    { id: 3, name: '程式碼沙盒測試', description: 'JS/CSS 前端即時預覽', invite_code: 'SPC-CODE' },
  ];

  const search = (query) => {
    const q = query.trim().toLowerCase();
    return mockSpaces.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.invite_code?.toLowerCase().includes(q)
    );
  };

  assert.strictEqual(search('化學').length, 1);
  assert.strictEqual(search('化學')[0].id, 1);

  assert.strictEqual(search('SPC-ENG1').length, 1);
  assert.strictEqual(search('SPC-ENG1')[0].id, 2);

  assert.strictEqual(search('前端').length, 1);
  assert.strictEqual(search('前端')[0].id, 3);

  assert.strictEqual(search('不存在的關鍵字').length, 0);
});

test('dashboard: 網址導覽狀態解析與直達比對 (?space=ID 與 ?share=SPC-XXXX)', () => {
  const parseNavigation = (search) => {
    const params = new URLSearchParams(search);
    const spaceId = params.get('space');
    const shareCode = params.get('share');
    if (shareCode) {
      return { view: 'space', type: 'guest', code: shareCode };
    }
    if (spaceId) {
      return { view: 'space', type: 'direct', spaceId: Number(spaceId) };
    }
    return { view: 'dashboard' };
  };

  assert.deepStrictEqual(parseNavigation(''), { view: 'dashboard' });
  assert.deepStrictEqual(parseNavigation('?foo=bar'), { view: 'dashboard' });
  assert.deepStrictEqual(parseNavigation('?space=42'), { view: 'space', type: 'direct', spaceId: 42 });
  assert.deepStrictEqual(parseNavigation('?share=SPC-9999'), { view: 'space', type: 'guest', code: 'SPC-9999' });
});
