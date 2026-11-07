import test from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { initDB } from '../src/server/db.js';
import authRoutes from '../src/server/routes/auth.js';
import spacesRoutes from '../src/server/routes/spaces.js';

test('hostedToolAndTeam: 獨立代管發布三模式、RBAC團隊協作、軟刪除復原與即時討論', async () => {
  initDB();

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/spaces', spacesRoutes);
  app.use('/api/hosted', (req, res, next) => {
    req.url = '/hosted' + req.url;
    spacesRoutes(req, res, next);
  });

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    const uid = Date.now() + Math.random().toString(36).slice(2, 6);

    // 建立擁有者帳號 (Owner)
    const ownerReg = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `owner_${uid}`,
        password: 'password123',
        displayName: '擁有者老師',
      }),
    });
    const { token: ownerToken, user: ownerUser } = await ownerReg.json();

    // 建立協作成員帳號 (Collaborator)
    const memberReg = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `member_${uid}`,
        password: 'password123',
        displayName: '協作同學',
      }),
    });
    const { token: memberToken, user: memberUser } = await memberReg.json();

    // 1. 建立空間
    const spRes = await fetch(`${baseUrl}/spaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ownerToken}` },
      body: JSON.stringify({ name: '代管與協作測試空間' }),
    });
    const { space } = await spRes.json();
    assert.ok(space.id);
    assert.ok(space.invite_code);

    // 2. 協作成員加入空間
    const joinRes = await fetch(`${baseUrl}/spaces/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${memberToken}` },
      body: JSON.stringify({ inviteCode: space.invite_code }),
    });
    assert.strictEqual(joinRes.status, 200);

    // 3. 驗證成員清單與預設角色 (Owner 為 owner, 新成員為 editor)
    const membersRes = await fetch(`${baseUrl}/spaces/${space.id}/members`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const membersData = await membersRes.json();
    assert.strictEqual(membersData.members.length, 2);
    const addedMember = membersData.members.find((m) => m.user_id === memberUser.id);
    assert.strictEqual(addedMember.role, 'editor');

    // 4. 新增工具 1 (由擁有者新增)
    const tool1Res = await fetch(`${baseUrl}/spaces/${space.id}/tools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ownerToken}` },
      body: JSON.stringify({
        title: '計時倒數鐘',
        type: 'html',
        content: '<div>計時小工具</div>',
      }),
    });
    const { tool: tool1 } = await tool1Res.json();
    assert.ok(tool1.id);

    // 5. 新增工具 2 (由協作者新增，驗證協作者新增權限)
    const tool2Res = await fetch(`${baseUrl}/spaces/${space.id}/tools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${memberToken}` },
      body: JSON.stringify({
        title: '代辦便籤條',
        type: 'html',
        content: '<div>便籤內容</div>',
      }),
    });
    const { tool: tool2 } = await tool2Res.json();
    assert.ok(tool2.id);

    // 6. 模式 1：發布單一小工具為獨立代管微應用 (Single Mode)
    const publishMode1Res = await fetch(`${baseUrl}/spaces/${space.id}/hosted`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ownerToken}` },
      body: JSON.stringify({
        mode: 'single',
        toolIds: [tool1.id],
        title: '獨立全螢幕計時器',
      }),
    });
    assert.strictEqual(publishMode1Res.status, 201);
    const mode1Data = await publishMode1Res.json();
    assert.ok(mode1Data.share.share_code.startsWith('HOST-'));
    assert.strictEqual(mode1Data.share.mode, 'single');

    // 免登入公開端點讀取模式 1 代管應用
    const publicMode1 = await fetch(`${baseUrl}/hosted/${mode1Data.share.share_code}`);
    assert.strictEqual(publicMode1.status, 200);
    const mode1App = await publicMode1.json();
    assert.strictEqual(mode1App.share.title, '獨立全螢幕計時器');
    assert.strictEqual(mode1App.tools.length, 1);
    assert.strictEqual(mode1App.tools[0].id, tool1.id);

    // 7. 模式 2：發布多工具客製分頁套件門戶 (Multi Tabs Mode)
    const publishMode2Res = await fetch(`${baseUrl}/spaces/${space.id}/hosted`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${memberToken}` },
      body: JSON.stringify({
        mode: 'multi',
        toolIds: [tool1.id, tool2.id],
        title: '學習雙工具工作門戶',
        customConfig: {
          tabLabels: {
            [tool1.id]: '專注鐘',
            [tool2.id]: '任務籤',
          },
          defaultLayout: 'tabs',
        },
      }),
    });
    assert.strictEqual(publishMode2Res.status, 201);
    const mode2Data = await publishMode2Res.json();
    assert.strictEqual(mode2Data.share.mode, 'multi');

    // 免登入公開讀取模式 2
    const publicMode2 = await fetch(`${baseUrl}/hosted/${mode2Data.share.share_code}`);
    assert.strictEqual(publicMode2.status, 200);
    const mode2App = await publicMode2.json();
    assert.strictEqual(mode2App.tools.length, 2);
    assert.strictEqual(mode2App.share.custom_config.tabLabels[tool1.id], '專注鐘');

    // 8. 模式 3：外部嵌入自適應支援 (iframe embed=true 查詢)
    const publicMode3 = await fetch(`${baseUrl}/hosted/${mode2Data.share.share_code}?embed=true`);
    assert.strictEqual(publicMode3.status, 200);

    // 9. 工具軟刪除 (Soft-delete) 與即時復原 (Undo / Restore)
    // 協作者刪除工具 1
    const delRes = await fetch(`${baseUrl}/spaces/${space.id}/tools/${tool1.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert.strictEqual(delRes.status, 200);

    // 檢查活躍工具清單：tool1 應已不在活躍工具中
    const activeSpaceRes = await fetch(`${baseUrl}/spaces/${space.id}`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const activeSpaceData = await activeSpaceRes.json();
    assert.strictEqual(activeSpaceData.tools.length, 1);
    assert.strictEqual(activeSpaceData.tools[0].id, tool2.id);

    // 檢查回收庫清單 (Trash)
    const trashRes = await fetch(`${baseUrl}/spaces/${space.id}/tools/trash`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const trashData = await trashRes.json();
    assert.strictEqual(trashData.trash.length, 1);
    assert.strictEqual(trashData.trash[0].id, tool1.id);

    // 復原工具 1 (Undo / Restore)
    const restoreRes = await fetch(`${baseUrl}/spaces/${space.id}/tools/${tool1.id}/restore`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert.strictEqual(restoreRes.status, 200);
    const restoreData = await restoreRes.json();
    assert.strictEqual(restoreData.tool.id, tool1.id);

    // 再次檢查空間工具：tool1 成功還原
    const restoredSpaceRes = await fetch(`${baseUrl}/spaces/${space.id}`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const restoredSpaceData = await restoredSpaceRes.json();
    assert.strictEqual(restoredSpaceData.tools.length, 2);

    // 10. RBAC 權限切換：Owner 將成員降級為 viewer
    const roleChangeRes = await fetch(`${baseUrl}/spaces/${space.id}/members/${memberUser.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ownerToken}` },
      body: JSON.stringify({ targetRole: 'viewer' }),
    });
    assert.strictEqual(roleChangeRes.status, 200);

    // 驗證 viewer 無法刪除工具 (403 阻斷)
    const forbiddenDelRes = await fetch(`${baseUrl}/spaces/${space.id}/tools/${tool2.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert.strictEqual(forbiddenDelRes.status, 403);

    // 11. 團隊對話與活動日誌廣播 (Team Chat)
    // 發送團隊訊息
    const sendMsgRes = await fetch(`${baseUrl}/spaces/${space.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${memberToken}` },
      body: JSON.stringify({ content: '大家好，我已經把小工具調整完畢了！' }),
    });
    assert.strictEqual(sendMsgRes.status, 201);
    const msgData = await sendMsgRes.json();
    assert.strictEqual(msgData.message.content, '大家好，我已經把小工具調整完畢了！');

    // 讀取團隊訊息與活動串流
    const chatDataRes = await fetch(`${baseUrl}/spaces/${space.id}/messages`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const chatData = await chatDataRes.json();
    assert.ok(chatData.messages.length >= 1);
    assert.ok(chatData.activities.length >= 1);

    // 12. 協作探測端點 (Sync Status)
    const syncRes = await fetch(`${baseUrl}/spaces/${space.id}/sync-status`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    assert.strictEqual(syncRes.status, 200);
    const syncData = await syncRes.json();
    assert.strictEqual(syncData.toolCount, 2);
    assert.strictEqual(syncData.memberCount, 2);
  } finally {
    server.close();
  }
});
